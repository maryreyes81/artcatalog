import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { getItems, deleteItem } from "../../src/lib/api";

export default function Index() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
      await loadItems();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo eliminar");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Inventa</Text>

        <Pressable
          onPress={() => router.push("/(tabs)/new")}
          style={{ paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 10 }}
        >
          <Text style={{ fontWeight: "bold" }}>+ Nuevo</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          style={{ marginTop: 16 }}
          onRefresh={loadItems}
            refreshing={loading}
             ListEmptyComponent={
          <Text style={{ marginTop: 24, textAlign: "center" }}>
            No hay items todavía. Toca “+ Nuevo” para crear el primero.
          </Text>
        }
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, marginBottom: 12 }}>
              <Pressable onPress={() => router.push(`/edit/${item.id}`)}
               style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: "bold" }}>Editar</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.nombre}</Text>
                <Text>{item.categoria}</Text>
                <Text>
                  {item.cantidad} {item.unidad}
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  Alert.alert("Eliminar", "¿Seguro?", [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Eliminar", style: "destructive", onPress: () => handleDelete(item.id) },
                  ])
                }
                style={{ marginTop: 8 }}
              >
                <Text style={{ color: "crimson", fontWeight: "bold" }}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}