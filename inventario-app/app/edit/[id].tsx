import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getItem, updateItem } from "../../src/lib/api"

export default function EditItem() {
  const { id } = useLocalSearchParams();
  const numericId = Number(id);

  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("pieza");
  const [imagenUrl, setImagenUrl] = useState("");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (Number.isNaN(numericId)) {
          Alert.alert("Error", "ID inválido");
          router.back();
          return;
        }
        const item = await getItem(numericId);
        setNombre(item.nombre);
        setCategoria(item.categoria);
        setCantidad(String(item.cantidad));
        setUnidad(item.unidad);
        setImagenUrl(item.imagenUrl ?? "");
        setNotas(item.notas ?? "");
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "No se pudo cargar");
      } finally {
        setLoading(false);
      }
    })();
  }, [numericId]);

  async function save() {
    try {
      await updateItem(numericId, {
        nombre,
        categoria,
        cantidad: Number(cantidad || 0),
        unidad,
        imagenUrl: imagenUrl || undefined,
        notas: notas || undefined,
      });
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo actualizar");
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Editar item</Text>

      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={input} />
      <TextInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} style={input} />
      <TextInput placeholder="Cantidad" keyboardType="numeric" value={cantidad} onChangeText={setCantidad} style={input} />
      <TextInput placeholder="Unidad" value={unidad} onChangeText={setUnidad} style={input} />
      <TextInput placeholder="Imagen URL (opcional)" value={imagenUrl} onChangeText={setImagenUrl} style={input} />
      <TextInput placeholder="Notas (opcional)" value={notas} onChangeText={setNotas} style={input} />

      <Pressable onPress={save} style={button}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Guardar cambios</Text>
      </Pressable>
    </ScrollView>
  );
}

const input = {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  padding: 10,
  marginBottom: 12,
};

const button = {
  backgroundColor: "#333",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
};