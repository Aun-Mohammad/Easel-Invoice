const currentDate = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

export const InvoiceConstants = {
  HeaderIcons: {
    phone: {
      text: '+92 345 5329935\n+92 331 3055001',
    },
    location: {
      text: 'Tri-angle (Humak) Industrial Area, kahuta / Kashmir Exit Islamabad, Express Highway Islamabad.',
    },
    globe: {
      text: 'www.redknot.com\nredknot.com/our-services',
    },
  },
  BelowHeader: {
    Reference: 'Salman Mazhar',
    GST: '',
    Date: currentDate,
    NT: '',
  },
  Note: `a) 80%adv required upon confirmation of order .
b) Fabric under international warrenty for 10 years. {for color & water repalent}
c) For complete Execution will take 7 working days only
d) Company is not responsible for any sharp cut or fire hazerd to fabric.
e) Rest payment will be made on completion of job.
f) Above offered are exclusive of any govt Taxes.
`,
};

export const formatText = (text) => {
  // Replace any unintended newlines within items with a space
  text = text.replace(/\n/g, ' ');

  // Define a regex to split on each bullet or number followed by a closing parenthesis
  const items = text.split(/(?=[a-zA-Z]\))/).map((item) => item.trim()).filter((item) => item);

  // Format each item with a newline between them
  const formattedText = items.join('\n\n');

  return formattedText;
};
