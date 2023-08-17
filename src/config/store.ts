import { produce } from "immer";
import { create } from "zustand";
import getRawDiseases from "../lib/getRawDiseases";
import getRawSymptoms from "../lib/getRawSymptoms";
import { IDisease, ISymptom } from "../types/interfaces";
import { persist, createJSONStorage } from "zustand/middleware";

const resetSymptom = (arr: ISymptom[], id: string) => {
  // populate item
  let item = arr.find((x) => x.id === id);
  // reset if found
  if (item) {
    console.log("Removing", item.id);
    // reset self
    item.value = null;
    // reset each child recursively
    if (Array.isArray(item.options)) {
      item.options.forEach((o) => resetSymptom(arr, o));
    }
  } else console.error("Couldn't find option", id);
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
  updateSymptom: (id: string, value: any, parent: ISymptom | null) => ISymptom[] | undefined;
  resetSymptoms: (...args: any[]) => void;
  expanded: string[];
  toggleExpanded: (id: string) => void;
  diseases: IDisease[];
  updateDiseases: (object: IDisease[]) => void;
}

export const useStore = create(
  persist<Store>(
    (set, get) => ({
      symptoms: getRawSymptoms(),
      updateSymptom: (id, value, parent) => {
        let result = undefined;
        set(
          produce((s) => {
            let arr: ISymptom[] = s.symptoms;
            let item = arr.find((i) => i.id === id);
            if (item) {
              // check item of enum parent -> reset parent -r
              if (parent && parent.type === "enum") resetSymptom(arr, parent.id);
              // if unset occured and has options -> reset item -r
              if (!value && Array.isArray(item.options)) resetSymptom(arr, item.id);
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
      updateDiseases: (object) => set(() => ({ diseases: getRawDiseases(object as IDisease[]) })),
    }),
    { name: "app-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
