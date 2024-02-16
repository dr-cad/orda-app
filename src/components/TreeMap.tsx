// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/treemap
import { ResponsiveTreeMap, TreeMapDataProps } from "@nivo/treemap";

export interface TreeMapItem {
  name: string;
  color?: string;
  children?: TreeMapItem[];
  loc?: number;
}

export default function TreeMap({ data }: TreeMapDataProps<TreeMapItem>) {
  return (
    <ResponsiveTreeMap
      data={data}
      identity="name"
      value="loc"
      valueFormat=" >-1.0%"
      tile="binary"
      leavesOnly={true}
      innerPadding={5}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      label={(e) => e.data.name + " (" + e.formattedValue + ")"}
      labelSkipSize={15}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.2]],
      }}
      orientLabel={false}
      parentLabelPosition="left"
      parentLabelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      // colors={({ data }) => data.color ?? "red"}
      colors={{ scheme: "dark2" }}
      nodeOpacity={0.5}
      borderWidth={2}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.1]],
      }}
    />
  );
}
