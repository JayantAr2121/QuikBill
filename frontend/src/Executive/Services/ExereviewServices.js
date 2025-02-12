import React, { useState } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Api from '../../Api/InstanceApi';

const ExereviewServices = ({ data }) => {
    const [customer, setcustomer] = useState({})
    const [shopkeeper, setshopkeeper] = useState({})
    const downloadInvoice = () => {
        const invoiceElement = document.getElementById('invoice-content'); // Target the invoice container
        html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Invoice.pdf'); // Download as Invoice.pdf
        });
    };
    const today = new Date(data?.result?.createdAt);
    const FutureDate = new Date()
    FutureDate.setDate(today.getDate() + 7)
    const getCustomer = async (token, id) => {
        try {
            const response = await Api.get("/getCustomer/" + id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) setcustomer(response?.data.existingCustomer)
            else alert(response?.data.message)
        } catch (error) {
            console.log(error);
            alert("Something went wrong. Try again later")
        }
    }
    const getShopkeeper = async (token) => {
        try {
            const response = await Api.get("/getShopkeeper", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
            if (response.status === 202) setshopkeeper(response?.data.existingShopkeeper)
            else alert(response?.data.message)
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('No response from server');
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }
    return { shopkeeper, getShopkeeper, getCustomer, customer, FutureDate, downloadInvoice }
}

export default ExereviewServices