import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { createItem } from "../../src/lib/api";

export default function NewItem() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("pieza");
  const [imagenUrl, setImagenUrl] = useState("");
  const [notas, setNotas] = useState("");

  async function save() {
    try {
      await createItem({
        nombre,
        categoria,
        cantidad: Number(cantidad || 0),
        unidad,
        imagenUrl: imagenUrl || undefined,
        notas: notas || undefined,
      });
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo crear");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>Nuevo item</Text>

      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={input} />
      <TextInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} style={input} />
      <TextInput placeholder="Cantidad" keyboardType="numeric" value={cantidad} onChangeText={setCantidad} style={input} />
      <TextInput placeholder="Unidad" value={unidad} onChangeText={setUnidad} style={input} />
      <TextInput placeholder="Imagen URL (opcional)" value={imagenUrl} onChangeText={setImagenUrl} style={input} />
      <TextInput placeholder="Notas (opcional)" value={notas} onChangeText={setNotas} style={input} />

      <Pressable onPress={save} style={button}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Guardar</Text>
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