import { StyleSheet } from "react-native";

export const BLUE = "#0062FF";
export const NAVY = "#091344";
export const MUTED = "#64729B";

export const styles = StyleSheet.create({
  hero: { backgroundColor: "#00213B", alignItems: "center", paddingTop: 12, paddingBottom: 36 },
  smallBrand: { alignItems: "center", paddingTop: 12 },
  slogan: { color: "white", fontSize: 10, letterSpacing: 1.4 },
  body: { padding: 24, width: "100%", maxWidth: 560, alignSelf: "center" },
  loginBody: { marginTop: -18, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: "white", flex: 1 },
  title: { color: NAVY, fontSize: 30, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: MUTED, fontSize: 18, lineHeight: 26, marginBottom: 20 },
  label: { color: NAVY, fontSize: 16, fontWeight: "700", marginBottom: 8 },
  field: { marginBottom: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F7FB", borderColor: "#DBE4F3", borderWidth: 1, borderRadius: 14, paddingLeft: 16, minHeight: 56 },
  input: { flex: 1, color: NAVY, fontSize: 16, padding: 12, minWidth: 0 },
  eye: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  hint: { color: MUTED, fontSize: 13, lineHeight: 20 },
  link: { color: BLUE, textDecorationLine: "underline" },
  options: { flexDirection: "row", gap: 10, marginBottom: 10 },
  option: { flex: 1, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#DBE4F3" },
  selected: { borderColor: BLUE, backgroundColor: "#E8F2FF" },
  optionTitle: { color: NAVY, fontSize: 14, fontWeight: "700", marginBottom: 3 },
  terms: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  button: { backgroundColor: BLUE, padding: 17, borderRadius: 15, alignItems: "center" },
  buttonText: { color: "white", fontSize: 19, fontWeight: "700" },
  footer: { alignItems: "center", gap: 8, borderTopWidth: 1, borderColor: "#DBE4F3", paddingTop: 20, marginTop: 24 },
  demo: { color: MUTED, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 18 },
});
