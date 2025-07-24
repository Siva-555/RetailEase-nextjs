"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import { formatUTCDate } from "@/lib/utils";
import { Bills } from "@prisma/client";

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-SemiBold.ttf",
  fontWeight: "semibold",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Italic.ttf",
  fontStyle: "italic",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Roboto",
  },
  heading: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "semibold",
  },
  section: {
    marginBottom: 10,
    border: "1px solid #d1d5dc",
    borderRadius: 8,
    padding: 12,
  },
  storeContainer: {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "12px",
    fontSize: 10,
    marginBottom: 12,
  },
  storeSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    flexWrap: "wrap",
    // gap: "8px",
  },
  customerSection: {
    marginBottom: 10,
    border: "1px solid #d1d5dc",
    borderRadius: 8,
    padding: 12,
    // width: "auto"
    fontSize: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  billInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    marginTop: 10,
    paddingBottom: 4,
    fontWeight: "semibold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #ccc",
    paddingVertical: 2,
  },
  cell: {
    flex: 1,
    textAlign: "left",
    paddingRight: 6,
  },
  totalSection: {
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  semiBoldText: {
    fontWeight: "semibold",
  },
  thankYou: {
    marginTop: 20,
    borderTop: "1 dashed #ccc",
    borderBottom: "1 dashed #ccc",
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center",
    color: "#6a7282",
  },
});

const viewField = (field: string, value: string | number | undefined) => {
  if (!value) return null;
  return (
    <View style={{ display: "flex", flexDirection: "row", marginBottom: 2 }}>
      <Text style={styles.semiBoldText}>{field}</Text>
      <Text style={{ marginLeft: 2 }}>{value}</Text>
    </View>
  );
};

const InvoicePDF = ({ billDetails }: { billDetails: Bills }) => {
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {billDetails?.store_name && (
          <Text style={[styles.heading, styles.boldText]}>
            {billDetails.store_name}
          </Text>
        )}

        {/* Store Info */}
        {billDetails.store_name ? (
          <View style={styles.storeContainer}>
            <View style={styles.storeSection}>
              {billDetails.store_address
                ? viewField("Address: ", billDetails.store_address)
                : null}
              {billDetails.mobile_no
                ? viewField("Mobile: ", billDetails.mobile_no)
                : null}
            </View>
            <View style={styles.storeSection}>
              {billDetails.pincode
                ? viewField("Pincode: ", billDetails.pincode)
                : null}
              {billDetails.fssai_no
                ? viewField("FSSAI: ", billDetails.fssai_no)
                : null}
            </View>
            <View style={styles.storeSection}>
              {billDetails.gst_no
                ? viewField("GST no: ", billDetails.gst_no)
                : null}
            </View>
          </View>
        ) : null}

        <Text style={[styles.heading, { fontSize: 12 }]}>TAX INVOICE</Text>

        {/* Bill Info */}
        <View style={styles.billInfo}>
          {billDetails?.bill_no && viewField("Bill No:", billDetails.bill_no)}
          {billDetails?.created_date &&
            viewField("Bill Dt:", formatUTCDate(billDetails.created_date))}
          {billDetails?.created_by &&
            viewField("Issuer:", billDetails.created_by)}
        </View>

        {/* Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Code</Text>
          <Text style={styles.cell}>Item</Text>
          <Text style={styles.cell}>Qty/Kg</Text>
          <Text style={styles.cell}>Price</Text>
          <Text style={styles.cell}>Total</Text>
        </View>

        {billDetails?.items?.map((item, idx) => (
          <View key={`${item.product_code}-${idx}`} style={styles.tableRow}>
            <Text style={styles.cell}>{item.product_code}</Text>
            <Text style={styles.cell}>{item.product_name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>₹{item.total.toFixed(2)}</Text>
            <Text style={styles.cell}>₹{item.total.toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.tableRow}>
          <Text style={styles.cell}>
            {viewField("Total items: ", billDetails.items.length)}
          </Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}>
            {viewField(
              "Qty: ",
              billDetails.items.reduce(
                (acc, ele) => acc + Number(ele.quantity),
                0
              )
            )}
          </Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.row}>
            <Text>Subtotal:</Text>
            <Text>₹{billDetails?.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Tax ({`${billDetails.tax_percentage}%`}):</Text>
            <Text>₹{billDetails?.tax?.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, styles.boldText]}>
            <Text>Total:</Text>
            <Text>₹{billDetails?.total?.toFixed(2)}</Text>
          </View>
        </View>

        <View style={[styles.customerSection, { marginTop: 10 }]}>
          <Text style={{ fontWeight: "semibold", marginBottom: 8 }}>
            Customer Details
          </Text>
          {billDetails?.customer_name &&
            viewField("Customer:", billDetails.customer_name)}
          {billDetails?.customer_email &&
            viewField("Email:", billDetails.customer_email)}
          {billDetails?.customer_phone &&
            viewField("Phone:", billDetails.customer_phone)}
        </View>

        {/* Thank You */}
        <View style={styles.thankYou}>
          <Text style={styles.boldText}>*** Thank you! Visit Again ***</Text>
          <Text style={{ fontStyle: "italic" }}>
            We appreciate your business and hope to see you soon.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
