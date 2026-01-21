import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 60, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a", lineHeight: 1.6 },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 60 },
    logoContainer: { width: 60, height: 60, marginBottom: 12 },
    logoImage: { width: '100%', height: '100%', objectFit: 'contain' },
    companyName: { fontSize: 12, fontWeight: "bold", textTransform: 'uppercase', letterSpacing: 1 },
    companyEmail: { color: "#777", fontSize: 9 },
    invoiceInfo: { textAlign: "right" },
    invoiceTitle: { fontSize: 32, fontWeight: "bold", marginBottom: 10, color: '#e2e8f0' },
    billingSection: { marginBottom: 40 },
    label: { fontSize: 7, color: "#94a3b8", marginBottom: 4, fontWeight: "bold", letterSpacing: 0.5 },
    clientName: { fontSize: 18, fontWeight: "bold" },
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#e5e7eb", borderRightWidth: 0, borderBottomWidth: 0 },
    tableRow: { margin: "auto", flexDirection: "row" },
    tableColHeader: { backgroundColor: "#f9fafb", borderStyle: "solid", borderBottomWidth: 1, borderColor: "#e5e7eb" },
    tableCellHeader: { margin: 5, fontSize: 8, fontWeight: "bold", color: "#64748b", textTransform: "uppercase" },
    tableCol: { borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, borderColor: "#e5e7eb" },
    tableCell: { margin: 8, fontSize: 10 },
    colDesc: { width: "55%" },
    colQty: { width: "10%", textAlign: "center" },
    colPrice: { width: "15%", textAlign: "right" },
    colAmount: { width: "20%", textAlign: "right" },
    totalSection: { marginTop: 30, flexDirection: "row", justifyContent: "flex-end" },
    totalLabel: { fontSize: 10, fontWeight: "bold", marginRight: 20, textTransform: 'uppercase' },
    totalAmount: { fontSize: 20, fontWeight: "bold" },
});

export default function InvoicePDF({ client, items, dates, issue_id }) {
    // Math logic: Ensure empty strings or undefined convert to 0
    const total = items.reduce((sum, i) => sum + (Number(i.qty || 0) * Number(i.price || 0)), 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <View style={styles.logoContainer}>
                            <Image src="/images/arlogo.png" style={styles.logoImage} />
                        </View>
                        <Text style={styles.companyEmail}>From</Text>
                        <Text style={styles.companyName}>AfterRender Studio</Text>
                        <Text style={styles.companyEmail}>video@afterrender.com</Text>
                    </View>
                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={{ fontSize: 10, fontWeight: 'bold' }}>#{issue_id}</Text>
                        <Text style={{ color: "#64748b", marginTop: 4 }}>Issued: {dates.issued}</Text>
                    </View>
                </View>

                <View style={styles.billingSection}>
                    <Text style={styles.label}>BILLED TO</Text>
                    <Text style={styles.clientName}>{client || "Unnamed Client"}</Text>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableColHeader]}>
                        <View style={[styles.tableCol, styles.colDesc]}><Text style={styles.tableCellHeader}>Description</Text></View>
                        <View style={[styles.tableCol, styles.colQty]}><Text style={styles.tableCellHeader}>Qty</Text></View>
                        <View style={[styles.tableCol, styles.colPrice]}><Text style={styles.tableCellHeader}>Price</Text></View>
                        <View style={[styles.tableCol, styles.colAmount]}><Text style={styles.tableCellHeader}>Amount</Text></View>
                    </View>

                    {items.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableCol, styles.colDesc]}><Text style={styles.tableCell}>{item.description || "Service"}</Text></View>
                            <View style={[styles.tableCol, styles.colQty]}><Text style={styles.tableCell}>{item.qty || 0}</Text></View>
                            <View style={[styles.tableCol, styles.colPrice]}><Text style={styles.tableCell}>${Number(item.price || 0).toFixed(2)}</Text></View>
                            <View style={[styles.tableCol, styles.colAmount]}><Text style={styles.tableCell}>${(Number(item.qty || 0) * Number(item.price || 0)).toFixed(2)}</Text></View>
                        </View>
                    ))}
                </View>

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Balance Due</Text>
                    <Text style={styles.totalAmount}>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                </View>
            </Page>
        </Document>
    );
}