import { ResponsiveTreeMap, TreeMapDataProps } from "@nivo/treemap";

export interface TreeMapItem {
  name: string;
  color?: string;
  children?: TreeMapItem[];
  value?: number;
}

export default function TreeMap({ data }: TreeMapDataProps<TreeMapItem>) {
  return (
    <ResponsiveTreeMap
      data={data}
      theme={{ tooltip: { container: { background: "#0005", borderRadius: 14 } } }}
      identity="name"
      value="value"
      valueFormat=" >-1.0%"
      tile="binary"
      leavesOnly={true}
      innerPadding={5}
      // margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      label={(e) => e.data.name + " (" + e.formattedValue + ")"}
      labelSkipSize={15}
      labelTextColor={"#fff"}
      orientLabel={false}
      parentLabelPosition="left"
      parentLabelTextColor={{
        from: "color",
        modifiers: [["brighter", 2]],
      }}
      // colors={({ data }) => data.color ?? "red"}
      colors={{ scheme: "dark2" }}
      nodeOpacity={1}
      borderWidth={0}
    />
  );
}
