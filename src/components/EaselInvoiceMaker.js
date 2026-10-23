"use client";

import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toWords } from 'number-to-words';
import { InvoiceConstants, formatText } from '@/lib/invoiceConstants';
import Image from 'next/image';
import redKnotImage from '../../public/red-knot.png';

// Styled components
const MainContainer = styled(Container)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: '350px',
  padding: theme.spacing(2),
  paddingTop: 0,
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflowX: 'hidden',
  '& p': {
    color: 'black',
    margin: '4px 0',
  },
  '& *': {
    color: 'black',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    overflowX: 'hidden',
  },
}));

const SubContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    overflowX: 'hidden',
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  '& img': {
    display: 'block',
    width: 'auto',
    maxWidth: '200px',
    maxHeight: '180px',
    height: 'auto',
    objectFit: 'contain',
  },
}));

const ConstantsContainer = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  fontSize: '12px',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

const BelowHeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  width: '100%',
  marginBottom: '5%',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderCollapse: 'collapse',
  width: '100%',
  minWidth: 650,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #ddd',
  padding: theme.spacing(1),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  borderBottom: '2px solid #751624',
  color: 'white',
  backgroundColor: '#751624',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& label': {
    color: 'black',
  },
  '& label.Mui-focused': {
    color: '#751624',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#751624',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#751624',
    },
    '&:hover fieldset': {
      borderColor: '#366932',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#751624',
    },
  },
  '& .MuiInputBase-input': {
    color: 'black',
  },
}));

const StyledTextFieldHeading = styled(TextField)(({ theme }) => ({
  '& label': {
    color: 'black',
  },
  '& label.Mui-focused': {
    color: '#751624',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#751624',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#366932',
    },
    '&:hover fieldset': {
      borderColor: '#366932',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#366932',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    WebkitTextFillColor: 'white',
  },
}));

const ActionButton = styled(IconButton)(({ theme, variant }) => ({
  padding: 0,
  backgroundColor: 'white',
  color: variant === 'delete' ? '#f41c6c' : '#751624',
  '&:hover': {
    color: 'white',
    backgroundColor: variant === 'delete' ? 'rgba(244, 28, 108,0.2)' : '#d1be04',
  },
}));

const TotalContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f8f9fa',
}));

const AmountContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
}));

const NotesContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const GenerateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(5),
  backgroundColor: '#751624',
  color: 'white',
  padding: theme.spacing(1.5, 3),
  borderRadius: '8px',
  '&:hover': {
    color: 'white',
    backgroundColor: '#751624',
  },
}));

const EaselInvoiceMaker = () => {
  const [formData, setFormData] = useState({
    reference: InvoiceConstants.BelowHeader.Reference,
    date: new Date().toISOString().substring(0, 10),
    gst: InvoiceConstants.BelowHeader.GST,
    ntn: InvoiceConstants.BelowHeader.NT,
    clientName: '',
    clientCity: '',
    clientPhone: '',
    items: [{ description: '', area: '', rate: '', total: '' }],
    totalAmount: 0,
    advancePayment: 0,
    discountReceived: '',
    amountInWords: '',
    InvoiceOrQuotation: 'Quotation',
    notes: InvoiceConstants.Note,
  });
  const [areaKey, setAreaKey] = useState(null);
  const [rateKey, setRateKey] = useState(null);
  const isQuotation =
    String(formData.InvoiceOrQuotation || '').trim().toLowerCase() === 'quotation';
  const previewTotalAmount = parseFloat(formData.totalAmount) || 0;
  const previewAdvanceAmount = previewTotalAmount * (parseFloat(formData.advancePayment) || 0) / 100;
  const previewBalanceAfterAdvance = previewTotalAmount - previewAdvanceAmount;
  const previewDiscountAmount = isQuotation
    ? previewBalanceAfterAdvance * (parseFloat(formData.discountReceived) || 0) / 100
    : 0;
  const previewFinalAmount = previewBalanceAfterAdvance - previewDiscountAmount;

  const capitalizeWords = (text) =>
    text
      .toLowerCase()
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(' ');

  useEffect(() => {
    const totalAmount = formData.items.reduce(
      (acc, item) => {
        const total = parseFloat(item.total || 0);
        return acc + (isNaN(total) ? 0 : total);
      },
      0
    );
    const advanceAmount = totalAmount * (parseFloat(formData.advancePayment) || 0) / 100;
    const balanceAfterAdvance = totalAmount - advanceAmount;
    const discountAmount = isQuotation
      ? balanceAfterAdvance * (parseFloat(formData.discountReceived) || 0) / 100
      : 0;
    const amountForWords = balanceAfterAdvance - discountAmount;

    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount.toFixed(2),
      amountInWords: capitalizeWords(toWords(Math.floor(amountForWords))),
    }));
  }, [formData.items, formData.advancePayment, formData.discountReceived, isQuotation]);

  const handleInputChange = (index, name, value) => {
    const updatedItems = formData.items.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [name]: value,
        };
      }
      return item;
    });

    if (name.toLowerCase().includes('area')) {
      const area = parseFloat(updatedItems[index][name] || 0);
      if (!isNaN(area)) {
        setAreaKey(name);
      } else {
        alert('Please enter a numeric value in area');
      }
    }

    if (name.toLowerCase().includes('rate')) {
      const rate = parseFloat(updatedItems[index][name] || 0);
      if (!isNaN(rate)) {
        setRateKey(name);
      } else {
        alert('Please enter a numeric value in rate');
      }
    }

    if (areaKey && rateKey) {
      const area = parseFloat(updatedItems[index][areaKey] || 0);
      const rate = parseFloat(updatedItems[index][rateKey] || 0);

      if (!isNaN(area) && !isNaN(rate)) {
        updatedItems[index].total = (area * rate).toFixed(2);
      }
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddRow = () => {
    // Preserve column order when adding new row
    if (!formData.items || formData.items.length === 0 || !formData.items[0]) {
      setFormData({ ...formData, items: [{ description: '', area: '', rate: '', total: '' }] });
      return;
    }
    const firstItem = formData.items[0];
    const keys = Object.keys(firstItem);
    const newRow = {};
    keys.forEach((key) => {
      newRow[key] = '';
    });
    setFormData({ ...formData, items: [...formData.items, newRow] });
  };

  const handleRemoveRow = (index) => {
    const items = [...formData.items];

    if (items.length <= 1) {
      alert('Cannot delete the last remaining row. At least one row is required.');
      return;
    }

    items.splice(index, 1);
    setFormData({ ...formData, items });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const logoWidth = 50;
    const logoHeight = logoWidth * redKnotImage.height / redKnotImage.width;
    const logoY = margin;

    const addHeader = () => {
      doc.setFontSize(8);
      doc.addImage('/red-knot.png', 'PNG', margin, logoY, logoWidth, logoHeight);

      const headerTextX = pageWidth - margin;
      const headerTextWidth = headerTextX - (margin + logoWidth + 8);
      const headerLines = [
        ...InvoiceConstants.HeaderIcons.phone.text.split('\n'),
        ...doc.splitTextToSize(InvoiceConstants.HeaderIcons.location.text, headerTextWidth),
        ...InvoiceConstants.HeaderIcons.globe.text.split('\n'),
      ];
      const headerLineSpacing = 4;
      const headerTextY =
        logoY +
        (logoHeight - (headerLines.length - 1) * headerLineSpacing) / 2 +
        2.5;

      headerLines.forEach((line, index) => {
        doc.text(line, headerTextX, headerTextY + index * headerLineSpacing, {
          align: 'right',
        });
      });
    };

    let yOffset = margin + logoHeight;
    addHeader();

    doc.setFontSize(10);
    const leftColumnX = margin;
    const rightColumnX = pageWidth - (doc.getTextWidth(`GST#: ${formData.gst}`) + margin);

    if (yOffset + 30 > pageHeight) {
      doc.addPage();
      addHeader();
      yOffset = margin + logoHeight;
    }
    yOffset += 20;
    doc.text(`Reference: ${formData.reference}`, leftColumnX, yOffset);
    if (formData.gst) doc.text(`GST#: ${formData.gst}`, rightColumnX, yOffset);
    yOffset += 5;
    doc.text(`Date: ${formData.date}`, leftColumnX, yOffset);
    if (formData.ntn) doc.text(`NTN#: ${formData.ntn}`, rightColumnX, yOffset);

    const clientDetails = [
      ['Name:', formData.clientName],
      ['City:', formData.clientCity],
      ['Phone:', formData.clientPhone],
    ];

    if (yOffset + 30 > pageHeight) {
      doc.addPage();
      addHeader();
      yOffset = margin + logoHeight;
    }

    autoTable(doc, {
      head: [['', '']],
      body: clientDetails,
      startY: (yOffset += 20),
      headStyles: { display: 'none' },
      tableWidth: 'auto',
      margin: { top: 10, left: 10, right: 10 },
      styles: {
        fontSize: 10,
        halign: 'left',
        cellPadding: 3,
        lineColor: [128, 128, 128],
        lineWidth: 0.1,
      },
      showHead: 'never',
      columnStyles: {
        0: { cellWidth: 35 },
        1: { halign: 'left' },
      },
    });

    yOffset = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    if (yOffset + 20 > pageHeight) {
      doc.addPage();
      addHeader();
      yOffset = margin + logoHeight;
    }
    doc.text(`${formData.InvoiceOrQuotation}`, pageWidth / 2, yOffset, null, null, 'center');
    yOffset += 15;

    if (!formData.items || formData.items.length === 0 || !formData.items[0]) {
      alert('No items to generate PDF');
      return;
    }
    const standardOrder = ['description', 'area', 'rate', 'total'];
    const firstItem = formData.items[0];
    const allKeys = Object.keys(firstItem);
    const standardKeys = standardOrder.filter((key) => allKeys.includes(key));
    const customKeys = allKeys.filter((key) => !standardOrder.includes(key));
    const orderedKeys = [...standardKeys, ...customKeys];

    let rows = formData.items.map((item, index) => [
      index + 1,
      ...orderedKeys.map((key) => item[key] || ''),
    ]);

    let headers = [
      'Serial No.',
      ...orderedKeys.map((key) =>
        key === 'area' ? 'Area/item' : key.charAt(0).toUpperCase() + key.slice(1)
      ),
    ];

    const columnCount = headers.length;

    const totalAmount = parseFloat(formData.totalAmount) || 0;
    const advanceAmount = totalAmount * (parseFloat(formData.advancePayment) || 0) / 100;
    const balanceAfterAdvance = totalAmount - advanceAmount;
    const discountAmount = isQuotation
      ? balanceAfterAdvance * (parseFloat(formData.discountReceived) || 0) / 100
      : 0;
    const finalAmount = balanceAfterAdvance - discountAmount;

    rows.push([
      {
        content: 'All total',
        colSpan: columnCount - 1,
        styles: { halign: 'center' },
      },
      `Rs:${totalAmount.toFixed(2)}`,
    ]);

    rows.push([
      {
        content: `Advance payment ${formData.advancePayment}%`,
        colSpan: columnCount - 1,
        styles: { halign: 'center' },
      },
      `Rs:${advanceAmount.toFixed(2)}`,
    ]);

    if (isQuotation && (parseFloat(formData.discountReceived) || 0) > 0) {
      rows.push([
        {
          content: `Discount received ${formData.discountReceived}%`,
          colSpan: columnCount - 1,
          styles: { halign: 'center' },
        },
        `Rs:${discountAmount.toFixed(2)}`,
      ]);
    }

    rows.push([
      {
        content: 'Balance Remaining',
        colSpan: columnCount - 1,
        styles: { halign: 'center' },
      },
      `Rs:${finalAmount.toFixed(2)}`,
    ]);

    if (yOffset + 20 > pageHeight) {
      doc.addPage();
      addHeader();
      yOffset = margin + logoHeight;
    }

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: yOffset,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [128, 128, 128],
        lineWidth: 0.1,
        halign: 'center',
      },
      headStyles: {
        fillColor: [117, 22, 36],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 70, halign: 'left' },
      },
      tableWidth: pageWidth - 20,
      margin: { top: 10, left: 10, right: 10 },
      didParseCell: function (data) {
        if (
          data.cell.text[0].includes('Advance payment') ||
          data.cell.text[0].includes('Discount received') ||
          data.cell.text[0] === 'All total' ||
          data.cell.text[0] === 'Balance Remaining'
        ) {
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    yOffset = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    if (yOffset + 10 > pageHeight) {
      doc.addPage();
      addHeader();
      yOffset = margin + logoHeight;
    }
    const amountInWordsText = `Amount in Words: ${formData.amountInWords}`;
    const textWidth = doc.getTextWidth(amountInWordsText);
    const xPosi = (pageWidth - textWidth) / 2;

    doc.text(amountInWordsText, xPosi, yOffset);

    yOffset += 15;
    if (yOffset + 70 > pageHeight) {
      doc.addPage();
      addHeader();
      yOffset = margin + logoHeight;
    }

    doc.text('Notes:', margin, yOffset);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(formatText(formData.notes), margin, yOffset + 10, {
      maxWidth: pageWidth - 2 * margin,
    });

    yOffset += 30;

    const barHeight = 10;
    const yPosition = pageHeight - barHeight;
    doc.setFillColor(117, 22, 36);
    doc.rect(0, yPosition, pageWidth, barHeight, 'F');

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Thank you for your business!', pageWidth / 2, yPosition + 6, {
      align: 'center',
    });

    doc.save(`Invoice_${formData.clientName}.pdf`);
  };

  const normalizeItemsOrder = (items) => {
    if (!items || items.length === 0) return items;

    const standardOrder = ['description', 'area', 'rate', 'total'];
    const firstItem = items[0];
    const allKeys = Object.keys(firstItem);
    const standardKeys = standardOrder.filter((key) => allKeys.includes(key));
    const customKeys = allKeys.filter((key) => !standardOrder.includes(key));
    const orderedKeys = [...standardKeys, ...customKeys];

    return items.map((item) => {
      const normalizedItem = {};
      orderedKeys.forEach((key) => {
        normalizedItem[key] = item[key] || '';
      });
      return normalizedItem;
    });
  };

  // Sanitize column names to prevent React errors (e.g., "html" as a component name)
  const sanitizeColumnName = (name) => {
    if (!name || typeof name !== 'string') {
      return 'column';
    }
    const problematicNames = ['html', 'body', 'head', 'script', 'style', 'meta', 'link', 'title', 'base'];
    const lowerName = name.toLowerCase().trim();
    if (problematicNames.includes(lowerName)) {
      return `col_${name}`;
    }
    return name.trim().replace(/[<>]/g, '');
  };

  const handleColumnChange = (index, newKey) => {
    const sanitizedKey = sanitizeColumnName(newKey) || `column_${index}`;

    setFormData((prevData) => {
      const updatedItems = prevData.items.map((item) => {
        const updatedItem = { ...item };
        const currentKey = Object.keys(updatedItem)[index];

        if (currentKey !== undefined) {
          const value = updatedItem[currentKey];
          const { [currentKey]: _, ...rest } = updatedItem;
          const newKeyToSet = sanitizedKey;
          const entries = Object.entries(rest);
          entries.splice(index, 0, [newKeyToSet, value]);
          const newItem = Object.fromEntries(entries);
          return newItem;
        }

        return updatedItem;
      });

      const normalizedItems = normalizeItemsOrder(updatedItems);

      return {
        ...prevData,
        items: normalizedItems,
      };
    });
  };

  const generateUniqueKey = (existingKeys) => {
    let newKey;
    let counter = 1;
    do {
      newKey = `New Column ${counter}`;
      counter++;
    } while (existingKeys.includes(newKey));
    return newKey;
  };

  const addColumnNextToIndex = (index) => {
    if (!formData.items || formData.items.length === 0 || !formData.items[0]) {
      return;
    }
    const existingKeys = Object.keys(formData.items[0]);
    const newKey = generateUniqueKey(existingKeys);

    const updatedItems = formData.items.map((item) => {
      const entries = Object.entries(item);
      entries.splice(index + 1, 0, [newKey, '']);
      return Object.fromEntries(entries);
    });

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeColumn = (index) => {
    if (!formData.items || formData.items.length === 0 || !formData.items[0]) {
      return;
    }
    const firstItem = formData.items[0];
    const keys = Object.keys(firstItem);

    if (keys.length <= 1) {
      alert('Cannot delete the last remaining column. At least one column is required.');
      return;
    }

    const updatedItems = formData.items.map((item) => {
      const itemKeys = Object.keys(item);
      if (index < itemKeys.length) {
        const newItem = { ...item };
        delete newItem[itemKeys[index]];
        return newItem;
      }
      return item;
    });

    const firstUpdatedItem = updatedItems[0];
    if (!firstUpdatedItem || Object.keys(firstUpdatedItem).length === 0) {
      alert('Cannot delete the last remaining column. At least one column is required.');
      return;
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  return (
    <MainContainer>
      <Box sx={{ mb: 3, pt: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: '#366932', fontWeight: 'bold', textAlign: 'center', mb: 1 }}
        >
        </Typography>
      </Box>

      <SubContainer>
        <HeaderSection>
          <LogoContainer>
            <Image
              src={redKnotImage}
              alt="Easel Outdoor logo"
              width={redKnotImage.width}
              height={redKnotImage.height}
            />
          </LogoContainer>
          <ConstantsContainer>
            {InvoiceConstants.HeaderIcons.phone.text
              .split('\n')
              .map((item, index) => <p key={index}>Phone: {item}</p>)}
            {InvoiceConstants.HeaderIcons.location.text
              .split('\n')
              .map((item, index) => <p key={index}>Location: {item}</p>)}
            {/* {InvoiceConstants.HeaderIcons.globe.text
              .split('\n')
              .map((item, index) => <p key={index}>Website: {item}</p>)} */}
          </ConstantsContainer>
        </HeaderSection>

        <BelowHeaderSection>
          <Box>
            <p>Reference: {InvoiceConstants.BelowHeader.Reference}</p>
            <StyledTextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </Box>
        </BelowHeaderSection>

        <Box sx={{ overflowX: 'auto' }}>
          <StyledTable>
            <TableBody>
              <TableRow>
                <StyledTableCell sx={{ color: 'black' }}>Client Name</StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: 'black' }}>Client City</StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={formData.clientCity}
                    onChange={(e) => setFormData({ ...formData, clientCity: e.target.value })}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: 'black' }}>Client Phone</StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </Box>

        <Box sx={{ textAlign: 'center', marginTop: '5%', marginBottom: '5%' }}>
          <StyledTextField
            label="Doc Type: (e.g Quotation or Invoice)"
            value={formData.InvoiceOrQuotation}
            onChange={(e) => setFormData({ ...formData, InvoiceOrQuotation: e.target.value })}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </Box>

        <TotalContainer>
          <Box sx={{ overflowX: 'auto' }}>
            <StyledTable>
              <StyledTableHead>
                <TableRow>
                  {formData.items && formData.items[0] && Object.keys(formData.items[0]).map((column, index) => (
                    <StyledTableCell key={index}>
                      <StyledTextFieldHeading
                        value={column}
                        onChange={(e) => handleColumnChange(index, e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                      />
                      <Box sx={{ textAlign: 'center' }}>
                        <ActionButton onClick={() => addColumnNextToIndex(index)}>
                          <AddIcon />
                        </ActionButton>
                        <ActionButton
                          variant="delete"
                          onClick={() => removeColumn(index)}
                          disabled={formData.items && formData.items[0] && Object.keys(formData.items[0]).length <= 1}
                          title={formData.items && formData.items[0] && Object.keys(formData.items[0]).length <= 1 ? 'Cannot delete the last column' : 'Delete column'}
                        >
                          <DeleteIcon />
                        </ActionButton>
                      </Box>
                    </StyledTableCell>
                  ))}
                  <StyledTableCell sx={{ position: 'relative' }}>
                    <Box sx={{ position: 'absolute', bottom: 10, color: 'white' }}>Actions</Box>
                  </StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {formData.items && formData.items.map((item, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {item && Object.keys(item).map((key, colIndex) => (
                      <StyledTableCell key={colIndex}>
                        <StyledTextField
                          name={key}
                          multiline
                          type={key === 'rate' || key === 'area' ? 'number' : 'text'}
                          value={item[key]}
                          onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                          fullWidth
                          variant="outlined"
                        />
                      </StyledTableCell>
                    ))}
                    <StyledTableCell sx={{ display: 'flex', flexDirection: 'row' }}>
                      <ActionButton variant="delete" onClick={() => handleRemoveRow(rowIndex)}>
                        <DeleteIcon />
                      </ActionButton>
                      <ActionButton onClick={handleAddRow}>
                        <AddIcon />
                      </ActionButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </Box>

          <StyledTextField
            label="Advance Payment Percentage"
            type="number"
            value={formData.advancePayment}
            onChange={(e) => setFormData({ ...formData, advancePayment: parseFloat(e.target.value) })}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {isQuotation && (
            <StyledTextField
              label="Discount Received Percentage (Optional)"
              type="number"
              value={formData.discountReceived}
              onChange={(e) => setFormData({ ...formData, discountReceived: e.target.value })}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          )}
          <AmountContainer>
            <p>Total Amount: {formData.totalAmount}</p>
            <p>Advance Payment: {previewAdvanceAmount.toFixed(2)}</p>
            {isQuotation && <p>Discount Received: {previewDiscountAmount.toFixed(2)}</p>}
            <p>Balance Remaining: {previewFinalAmount.toFixed(2)}</p>
            <p>Amount in Words: {formData.amountInWords}</p>
          </AmountContainer>
        </TotalContainer>
      </SubContainer>

      <NotesContainer>
        <StyledTextField
          label="Terms and conditions"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
        />
      </NotesContainer>

      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <GenerateButton onClick={generatePDF}>Generate PDF</GenerateButton>
      </Box>
    </MainContainer>
  );
};

export default EaselInvoiceMaker;
