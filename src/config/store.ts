import { produce } from "immer";
import { create } from "zustand";
import getRawDiseases from "../lib/diseases";
import getRawSymptoms from "../lib/symptoms";
import { IDisease, ISymptom } from "../types/interfaces";
import { persist, createJSONStorage } from "zustand/middleware";

const recursivelyResetItem = (arr: ISymptom[], id: string) => {
  // populate item
  let item = arr.find((x) => x.id === id);
  // reset if found
  if (item) {
    console.log("Removing", item.id);
    // reset self
    item.value = null;
    // reset each child recursively
    if (Array.isArray(item.options)) {
      item.options.forEach((o) => recursivelyResetItem(arr, o));
    }
  } else console.error("Couldn't find option", id);
};

const recursivelyResetParents = (arr: ISymptom[], id: string) => {
  // find a parent which has this id as a child
  const parent = arr.find((p) => p.options?.includes(id));
  if (parent) {
    if (parent.type === "enum") {
      console.log("Cleaning Parent", parent.id);
      for (const option of parent.options ?? []) {
        if (option === id) continue;
        recursivelyResetItem(arr, parent.id);
      }
    }
    recursivelyResetParents(arr, parent.id);
  }
};

const getRawExpanded = () => {
  const rawSymptoms = getRawSymptoms();
  const expandedSet = new Set<string>();
  rawSymptoms.forEach((i) => {
    if (i.open) expandedSet.add(i.id);
  });
  return Array.from(expandedSet);
};

interface Store {
  symptoms: ISymptom[];
  updateSymptom: (id: string, value: any) => ISymptom[] | undefined;
  resetSymptoms: (...args: any[]) => void;
  expanded: string[];
  toggleExpanded: (id: string) => void;
  diseases: IDisease[];
}

export const useStore = create(
  persist<Store>(
    (set, get) => ({
      symptoms: getRawSymptoms(),
      updateSymptom: (id, value) => {
        let result = undefined;
        set(
          produce((s) => {
            let arr: ISymptom[] = s.symptoms;
            let item = arr.find((i) => i.id === id);
            if (item) {
              // check item of enum parent -> reset parent -r
              recursivelyResetParents(arr, item.id);
              // if unset occured and has options -> reset item -r
              if (!value) recursivelyResetItem(arr, item.id);
              // update/reset value
              console.log("Setting", id, value);
              item.value = value;
              result = arr;
            } else {
              console.error("Couldnt find item", id);
            }
            result = arr;
          })
        );
        return result;
      },
      resetSymptoms: () => {
        set(() => ({ symptoms: getRawSymptoms() }));
        console.log(get().symptoms);
      },
      expanded: getRawExpanded(),
      toggleExpanded: (id) =>
        set((s) => {
          const list = new Set(s.expanded);
          if (list.has(id)) list.delete(id);
          else list.add(id);
          return { expanded: Array.from(list) };
        }),
      diseases: getRawDiseases(),
    }),
    { name: "app-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
