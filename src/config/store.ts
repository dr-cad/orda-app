import sha256 from "crypto-js/sha256";
import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import getRawDiseases from "../lib/diseases";
import getRawSymptoms from "../lib/symptoms";
import { IDisease, IHistoryItem, ISymptom, Value } from "../types/interfaces";

const recursivelyResetItem = (arr: ISymptom[], id: string) => {
  // populate item
  let item = arr.find((x) => x.id === id);
  // reset if found
  if (item) {
    console.log("Removing", item.id);
    // reset self
    item.value = undefined;
    // reset each child recursively
    if (Array.isArray(item.options)) {
      item.options.forEach((o) => recursivelyResetItem(arr, o));
    }
  } else console.error("Couldn't find option", id);
};

const recursivelyUpdateParents = (arr: ISymptom[], id: string) => {
  // find a parent which has this id as a child
  const parent = arr.find((p) => p.options?.includes(id));
  if (parent) {
    console.log("Updating Parent", parent.id);
    parent.value = false;
    for (const option of parent.options ?? []) {
      // reset siblings of enum parent
      if (parent.type === "enum" && option !== id) recursivelyResetItem(arr, option);
      // set ancestors whom have value
      // it works: because it fills from inner parents to outer ones
      const item = arr.find((item) => item.id === option);
      if (!!item?.value) parent.value = true;
    }
    recursivelyUpdateParents(arr, parent.id);
  }
};

const getRawExpanded = (openAll = false) => {
  const rawSymptoms = getRawSymptoms();
  const expandedSet = new Set<string>();
  rawSymptoms.forEach((i) => {
    if (openAll || i.open) expandedSet.add(i.id);
  });
  return Array.from(expandedSet);
};

interface Store {
  symptoms: ISymptom[];
  updateSymptom: (id: string, value: Value) => ISymptom[] | undefined;
  expanded: string[];
  toggleExpanded: (id: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  diseases: IDisease[];
  reset: () => void;
  history: IHistoryItem[];
  addHistory: (history: IHistoryItem) => IHistoryItem[];
  removeHistory: (index: number) => void;
  loadHistory: (symptoms: ISymptom[]) => void;
  // app settings
  autoBackup: boolean;
}

export const useStore = create(
  persist<Store>(
    (set, get) => ({
      symptoms: getRawSymptoms(),
      updateSymptom: (id, value) => {
        let result = undefined;
        set(
          produce((s: Store) => {
            let arr: ISymptom[] = s.symptoms;
            let item = arr.find((i) => i.id === id);
            if (item) {
              // if unset occured and has options -> reset item -r
              if (!value) recursivelyResetItem(arr, item.id);
              // update/reset value
              console.log("Updating", id, value);
              item.value = value;
              recursivelyUpdateParents(arr, item.id);
              result = arr;
            } else {
              console.error("Couldnt find item", id);
            }
            result = arr;
          })
        );
        return result;
      },
      reset: () => {
        set(() => ({
          // ...
          symptoms: getRawSymptoms(),
          expanded: getRawExpanded(),
          diseases: getRawDiseases(),
        }));
      },
      expanded: getRawExpanded(),
      toggleExpanded: (id) =>
        set((s) => {
          const list = new Set(s.expanded);
          if (list.has(id)) list.delete(id);
          else list.add(id);
          return { expanded: Array.from(list) };
        }),
      collapseAll: () => {
        set(() => ({ expanded: [] }));
      },
      expandAll: () => {
        set(() => ({ expanded: getRawExpanded(true) }));
      },
      diseases: getRawDiseases(),
      history: [],
      addHistory: (item) => {
        // hash validation for duplicate
        const hash = sha256(JSON.stringify(item.symptoms)).toString();
        const currentHistory = get().history;
        if (currentHistory.some((h) => h.hash === hash)) {
          return currentHistory;
        }
        // if new push-back item
        item.hash = hash;
        const newHistory = [item, ...currentHistory];
        set((s) => ({ history: newHistory }));
        return newHistory;
      },
      removeHistory: (index) => {
        set(
          produce((s: Store) => {
            s.history.splice(index, 1);
          })
        );
      },
      loadHistory: (symptoms) => {
        set(() => ({ symptoms }));
      },
      // app settings
      autoBackup: false,
    }),
    { name: "app-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
