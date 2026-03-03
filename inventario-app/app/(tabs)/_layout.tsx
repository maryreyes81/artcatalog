import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "ArtCatalog" }}
      />
      <Tabs.Screen
        name="new"
        options={{ title: "Nuevo" }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Explorar" }}
      />
    </Tabs>
  );
}