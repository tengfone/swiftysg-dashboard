import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";

export default function InvoicePage(props) {
  const [numPages, setNumPages] = useState(null);
  const router = useRouter();
  const id = router.query.invoiceID;

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
  };

  return (
    <>
      <Navbar />
      <Document
        file={"https://swiftys-server.glitch.me/api/orders/getInvoice/" + id}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </>
  );
}
