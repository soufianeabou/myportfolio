import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu, X, ChevronDown, Calendar, Search, 
  Settings, LogOut, Bell, FileText, BarChart2, 
  Database, RefreshCw, ChevronRight, Sliders, Grid, Columns, List, CreditCard,
  Sun, Moon
} from 'lucide-react';
import ReportTable from './ReportTable';
import DataVisualizer from './DataVisualizer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create and export ThemeContext
export const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleDarkMode: () => {}
});

/**
 * Enhanced TCPOS Reports Dashboard
 * 
 * This component serves as the main dashboard for the TCPOS reporting system.
 * It implements the V_CA report with real API integration.
 */
const EnhancedDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeReport, setActiveReport] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [reportData, setReportData] = useState({ columns: [], rows: [] });
  const [filters, setFilters] = useState({});
  const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
  const [activeColumns, setActiveColumns] = useState([]);
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showTotalOnly, setShowTotalOnly] = useState(false);
  // Add state for search
  const [headerSearch, setHeaderSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  // Notification context and state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultRowsPerPage, setDefaultRowsPerPage] = useState(50);
  const [anomalies, setAnomalies] = useState([]);
  const [showAnomalyModal, setShowAnomalyModal] = useState(false);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareFilters, setCompareFilters] = useState({});
  const [compareData, setCompareData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const { user, logout } = useAuth();

  // Define the reports with updated titles but keeping original styling
  const reports = useMemo(() => [
    { 
      id: 'v_ca', 
      name: "Chiffre d'affaire", 
      icon: <BarChart2 size={20} />,
      description: 'Données des transactions et chiffre d\'affaire',
      endpoint: '/vca',
      filters: [
        { 
          id: 'trans_num',
          type: 'number',
          label: 'Transaction Number',
          apiParam: 'trans_num',
          placeholder: 'Enter transaction number'
        },
        { 
          id: 'shop', 
          type: 'text', 
          label: 'Shop', 
          apiParam: 'shop',
          placeholder: 'Enter shop name (e.g. AUI SHOP)'
        },
        { 
          id: 'caisse', 
          type: 'text', 
          label: 'Caisse', 
          apiParam: 'caisse',
          placeholder: 'Enter caisse name (e.g. CAISSE SUPERETTE)'
        },
        { 
          id: 'trans_date_range', 
          type: 'date-range', 
          label: 'Transaction Date',
          apiParam: 'trans_date_range'
        },
        { 
          id: 'bookkeeping_date_range', 
          type: 'date-range', 
          label: 'Bookkeeping Date',
          apiParam: 'bookkeeping_date_range'
        },
        { 
          id: 'code', 
          type: 'text', 
          label: 'Code (Primary)',
          apiParam: 'code',
          placeholder: 'Enter code value'
        },
        { 
          id: 'card_num', 
          type: 'text', 
          label: 'Card Number',
          apiParam: 'card_num',
          placeholder: 'Enter card number'
        },
        { 
          id: 'payments', 
          type: 'text', 
          label: 'Payment Method', 
          apiParam: 'payments',
          placeholder: 'Enter payment method (e.g. WALLET, CASH)'
        },
        { 
          id: 'operator', 
          type: 'text', 
          label: 'Operator', 
          apiParam: 'operator',
          placeholder: 'Enter operator name'
        }
      ]
    },
    {
      id: 'vca_frn',
      name: "Chiffre d'affaire fournisseur",
      icon: <FileText size={20} />,
      description: 'Données des fournisseurs',
      endpoint: '/vca_frn',
      filters: [
        {
          id: 'stock_supplier_id',
          type: 'text',
          label: 'Supplier ID',
          apiParam: 'stock_supplier_id',
          placeholder: 'Enter supplier ID'
        },
        {
          id: 'stock_supplier_id_lookup',
          type: 'text',
          label: 'Supplier Lookup',
          apiParam: 'stock_supplier_id_lookup',
          placeholder: 'Enter supplier lookup value'
        },
        {
          id: 'delivery_note_date_range',
          type: 'date-range',
          label: 'Delivery Note Date',
          apiParam: 'delivery_note_date_range'
        }
      ]
    },
    {
      id: 'vcadet_all',
      name: "Chiffre d'affaires détaillé",
      icon: <Database size={20} />,
      description: 'Données détaillées des transactions',
      endpoint: '/vcadet_all',
      filters: [
        {
          id: 'trans_date_range',
          type: 'date-range',
          label: 'Transaction Date',
          apiParam: 'trans_date_range'
        },
        {
          id: 'bookkeeping_date_range',
          type: 'date-range',
          label: 'Bookkeeping Date',
          apiParam: 'bookkeeping_date_range'
        },
        {
          id: 'trans_num',
          type: 'number',
          label: 'Transaction Number',
          apiParam: 'trans_num',
          placeholder: 'Enter transaction number'
        },
        {
          id: 'shop',
          type: 'text',
          label: 'Shop',
          apiParam: 'shop',
          placeholder: 'Enter shop name'
        },
        {
          id: 'caisse',
          type: 'text',
          label: 'Caisse',
          apiParam: 'caisse',
          placeholder: 'Enter caisse name'
        },
        {
          id: 'articles',
          type: 'text',
          label: 'Articles',
          apiParam: 'articles',
          placeholder: 'Enter article name'
        },
        {
          id: 'qty_weight',
          type: 'number',
          label: 'Quantity/Weight',
          apiParam: 'qty_weight',
          placeholder: 'Enter quantity or weight'
        },
        {
          id: 'code',
          type: 'text',
          label: 'Code',
          apiParam: 'code',
          placeholder: 'Enter code'
        },
        {
          id: 'operator',
          type: 'text',
          label: 'Operator',
          apiParam: 'operator',
          placeholder: 'Enter operator name'
        },
        {
          id: 'payement',
          type: 'text',
          label: 'Payment',
          apiParam: 'payement',
          placeholder: 'Enter payment type'
        }
      ]
    },
    {
      id: 'vliste_transac',
      name: "Liste des transactions",
      icon: <List size={20} />,
      description: 'Liste complète des transactions',
      endpoint: '/vliste_transac',
      filters: [
        {
          id: 'date_range',
          type: 'date-range',
          label: 'Date Range',
          apiParam: 'date_range'
        },
        {
          id: 'transaction_number',
          type: 'number',
          label: 'Transaction Number',
          apiParam: 'transaction_number',
          placeholder: 'Enter transaction number'
        },
        {
          id: 'shops',
          type: 'text',
          label: 'Shops',
          apiParam: 'shops',
          placeholder: 'Enter shop names'
        },
        {
          id: 'article',
          type: 'text',
          label: 'Article',
          apiParam: 'article',
          placeholder: 'Enter article'
        },
        {
          id: 'client',
          type: 'text',
          label: 'Client',
          apiParam: 'client',
          placeholder: 'Enter client name'
        },
        {
          id: 'matricule',
          type: 'text',
          label: 'Matricule',
          apiParam: 'matricule',
          placeholder: 'Enter matricule'
        }
      ]
    },
    {
      id: 'vlistRecharge',
      name: "Liste des recharges",
      icon: <CreditCard size={20} />,
      description: 'Liste des recharges effectuées',
      endpoint: '/vlistRecharge',
      filters: [
        {
          id: 'trans_date_range',
          type: 'date-range',
          label: 'Transaction Date',
          apiParam: 'trans_date_range'
        },
        {
          id: 'bookkeeping_date_range',
          type: 'date-range',
          label: 'Bookkeeping Date',
          apiParam: 'bookkeeping_date_range'
        },
        {
          id: 'trans_num',
          type: 'number',
          label: 'Transaction Number',
          apiParam: 'trans_num',
          placeholder: 'Enter transaction number'
        },
        {
          id: 'till_id',
          type: 'text',
          label: 'Till ID',
          apiParam: 'till_id',
          placeholder: 'Enter till ID'
        },
        {
          id: 'till',
          type: 'text',
          label: 'Till',
          apiParam: 'till',
          placeholder: 'Enter till name'
        },
        {
          id: 'payment_id',
          type: 'text',
          label: 'Payment ID',
          apiParam: 'payment_id',
          placeholder: 'Enter payment ID'
        },
        {
          id: 'is_prepayment',
          type: 'boolean',
          label: 'Is Prepayment',
          apiParam: 'is_prepayment',
          placeholder: 'Select prepayment status'
        },
        {
          id: 'description',
          type: 'text',
          label: 'Description',
          apiParam: 'description',
          placeholder: 'Enter description'
        },
        {
          id: 'ncompte',
          type: 'text',
          label: 'Account Number',
          apiParam: 'ncompte',
          placeholder: 'Enter account number'
        },
        {
          id: 'code',
          type: 'text',
          label: 'Code',
          apiParam: 'code',
          placeholder: 'Enter code'
        },
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          apiParam: 'name',
          placeholder: 'Enter name'
        },
        {
          id: 'card_num',
          type: 'text',
          label: 'Card Number',
          apiParam: 'card_num',
          placeholder: 'Enter card number'
        }
      ]
    },
    {
      id: 'vRecharge',
      name: "Recharge mobile",
      icon: <CreditCard size={20} />,
      description: 'Données des recharges mobiles (IAM, Inwi, Orange)',
      endpoint: '/vRecharge',
      filters: [
        {
          id: 'date_range',
          type: 'date-range',
          label: 'Transaction Date',
          apiParam: 'date_range'
        },
        {
          id: 'id',
          type: 'text',
          label: 'ID',
          apiParam: 'id',
          placeholder: 'Enter ID'
        },
        {
          id: 'recharge',
          type: 'text',
          label: 'Recharge',
          apiParam: 'recharge',
          placeholder: 'Enter recharge value'
        },
        {
          id: 'client',
          type: 'text',
          label: 'Client',
          apiParam: 'client',
          placeholder: 'Enter client name'
        },
        {
          id: 'code',
          type: 'text',
          label: 'Code',
          apiParam: 'code',
          placeholder: 'Enter code'
        },
        {
          id: 'num_ticket',
          type: 'text',
          label: 'Ticket Number',
          apiParam: 'num_ticket',
          placeholder: 'Enter ticket number'
        },
        {
          id: 'caissier',
          type: 'text',
          label: 'Cashier',
          apiParam: 'caissier',
          placeholder: 'Enter cashier name'
        }
      ]
    },
    {
      id: 'vcadet_bo',
      name: "Chiffre d'affaires BO",
      icon: <Database size={20} />,
      description: 'Données détaillées des transactions business office',
      endpoint: '/vcadet_bo',
      filters: [
        {
          id: 'trans_date_range',
          type: 'date-range',
          label: 'Transaction Date',
          apiParam: 'trans_date_range'
        },
        {
          id: 'bookkeeping_date_range',
          type: 'date-range',
          label: 'Bookkeeping Date',
          apiParam: 'bookkeeping_date_range'
        },
        {
          id: 'trans_num',
          type: 'number',
          label: 'Transaction Number',
          apiParam: 'trans_num',
          placeholder: 'Enter transaction number'
        },
        {
          id: 'shop',
          type: 'text',
          label: 'Shop',
          apiParam: 'shop',
          placeholder: 'Enter shop name'
        },
        {
          id: 'caisse',
          type: 'text',
          label: 'Caisse',
          apiParam: 'caisse',
          placeholder: 'Enter caisse name'
        },
        {
          id: 'articles',
          type: 'text',
          label: 'Articles',
          apiParam: 'articles',
          placeholder: 'Enter article name'
        },
        {
          id: 'code',
          type: 'text',
          label: 'Code',
          apiParam: 'code',
          placeholder: 'Enter code'
        },
        {
          id: 'operator',
          type: 'text',
          label: 'Operator',
          apiParam: 'operator',
          placeholder: 'Enter operator name'
        },
        {
          id: 'payement',
          type: 'text',
          label: 'Payment Method',
          apiParam: 'payement',
          placeholder: 'Enter payment method'
        }
      ]
    }
  ], []);

  // Define column mappings for each report using useMemo
  const columnMappings = useMemo(() => ({
    v_ca: [
      { key: 'trans_num', label: 'Transaction Number' },
      { key: 'shop', label: 'Shop' },
      { key: 'caisse', label: 'Caisse' },
      { key: 'bookkeeping_date', label: 'Bookkeeping Date' },
      { key: 'trans_date', label: 'Transaction Date' },
      { key: 'total_amount', label: 'Total Amount' },
      { key: 'description', label: 'Description' },
      { key: 'code', label: 'Code' },
      { key: 'card_num', label: 'Card Number' },
      { key: 'payments', label: 'Payments' },
      { key: 'operator', label: 'Operator' }
      ],
    vca_frn: [
      { key: 'stock_supplier_id', label: 'Supplier ID' },
      { key: 'stock_supplier_id_lookup', label: 'Supplier Lookup' },
      { key: 'article', label: 'Article' },
      { key: 'expr1', label: 'Amount' },
      { key: 'delivery_note_date', label: 'Delivery Note Date' }
    ],
    vcadet_all: [
      { key: 'trans_num', label: 'Transaction Number' },
      { key: 'shop', label: 'Shop' },
      { key: 'caisse', label: 'Caisse' },
      { key: 'trans_date', label: 'Transaction Date' },
      { key: 'bookkeeping_date', label: 'Bookkeeping Date' },
      { key: 'qty_weight', label: 'Quantity/Weight' },
      { key: 'price', label: 'Price' },
      { key: 'articles', label: 'Articles' },
      { key: 'code', label: 'Code' },
      { key: 'card_num', label: 'Card Number' },
      { key: 'name', label: 'Customer Name' },
      { key: 'operator', label: 'Operator' },
      { key: 'payement', label: 'Payment Method' }
    ],
    vliste_transac: [
      { key: 'id', label: 'ID' },
      { key: 'transaction_number', label: 'Transaction Number' },
      { key: 'date', label: 'Transaction Date' },
      { key: 'total_transactions_initial', label: 'Total Amount' },
      { key: 'shops', label: 'Shop' },
      { key: 'quantite', label: 'Quantity' },
      { key: 'prix', label: 'Unit Price' },
      { key: 'article', label: 'Article' },
      { key: 'client', label: 'Client' },
      { key: 'matricule', label: 'Matricule' },
      { key: 'paiement_transaction_initial', label: 'Payment Amount' },
      { key: 'ancien_solde', label: 'Previous Balance' }
    ],
    vlistRecharge: [
      { key: 'id', label: 'ID' },
      { key: 'trans_num', label: 'Transaction Number' },
      { key: 'till_id', label: 'Till ID' },
      { key: 'shop_id', label: 'Shop ID' },
      { key: 'bookkeeping_date', label: 'Bookkeeping Date' },
      { key: 'trans_date', label: 'Transaction Date' },
      { key: 'delete_operator_id', label: 'Delete Operator ID' },
      { key: 'payment_id', label: 'Payment ID' },
      { key: 'amount', label: 'Amount' },
      { key: 'is_prepayment', label: 'Is Prepayment' },
      { key: 'description', label: 'Description' },
      { key: 'till', label: 'Till' },
      { key: 'shop', label: 'Shop' },
      { key: 'ncompte', label: 'Account Number' },
      { key: 'card_num', label: 'Card Number' },
      { key: 'code', label: 'Code' },
      { key: 'name', label: 'Name' },
      { key: 'payment_note', label: 'Payment Note' },
      { key: 'digital_authorization_num', label: 'Digital Authorization' },
      { key: 'digital_payment_id', label: 'Digital Payment ID' }
    ],
    vcadet_bo: [
      { key: 'id', label: 'ID' },
      { key: 'trans_date', label: 'Transaction Date' },
      { key: 'bookkeeping_date', label: 'Bookkeeping Date' },
      { key: 'trans_num', label: 'Transaction Number' },
      { key: 'shop', label: 'Shop' },
      { key: 'caisse', label: 'Caisse' },
      { key: 'qty_weight', label: 'Quantity/Weight' },
      { key: 'price', label: 'Price' },
      { key: 'articles', label: 'Articles' },
      { key: 'code', label: 'Code' },
      { key: 'card_num', label: 'Card Number' },
      { key: 'name', label: 'Customer Name' },
      { key: 'operator', label: 'Operator' },
      { key: 'payement', label: 'Payment Method' }
    ],
    vRecharge: [
      { key: '_id', label: 'Internal ID' },
      { key: 'id', label: 'ID' },
      { key: 'recharge', label: 'Recharge' },
      { key: 'qte', label: 'Quantity' },
      { key: 'transaction_date', label: 'Transaction Date' },
      { key: 'card_num', label: 'Card Number' },
      { key: 'client', label: 'Client' },
      { key: 'code', label: 'Code' },
      { key: 'num_ticket', label: 'Ticket Number' },
      { key: 'caissier', label: 'Cashier' }
    ]
  }), []);

  // Update the defaultColumns to use the memoized columnMappings
  const defaultColumns = useMemo(() => {
    return columnMappings[activeReport] || [];
  }, [activeReport, columnMappings]);

  // Initialize available columns and active columns
  useEffect(() => {
    if (!activeReport) return;
    
    const columns = columnMappings[activeReport] || [];
    setAvailableColumns(columns);
    
    // Only initialize activeColumns if they haven't been set for this report
    if (activeColumns.length === 0) {
      setActiveColumns(columns.map(col => col.key));
    }
  }, [activeReport, columnMappings, activeColumns.length]);

  // Simplified column toggle with memoization
  const handleColumnToggle = useMemo(() => (columnKey) => {
    setActiveColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow removing if only one column is left
        if (prev.length === 1) {
          alert('At least one column must remain visible');
          return prev;
        }
        return prev.filter(key => key !== columnKey);
      }
      return [...prev, columnKey];
    });
  }, []);

  // Reset columns to show all - memoized to prevent recreation
  const resetColumns = useMemo(() => () => {
    const allColumns = columnMappings[activeReport]?.map(col => col.key) || [];
    setActiveColumns(allColumns);
  }, [activeReport, columnMappings]);

  // Update processResponseData to handle visualization fields for vliste_transac
  const processResponseData = useMemo(() => (data) => {
    console.log('Processing response data...');
    const responseData = Array.isArray(data) ? data : [data];
    
    // Get current report configuration
    const report = reports.find(r => r.id === activeReport);
    if (!report) {
        throw new Error('Report configuration not found');
    }

    // Handle summary table for date-filtered reports
    if (showTotalOnly && (activeReport === 'v_ca' || activeReport === 'vlistRecharge' || activeReport === 'vcadet_bo')) {
      // Get date range from filters
      const dateFilter = Object.values(filters).find(f => f.start && f.end);
      if (!dateFilter) return { columns: [], rows: [] };

      // Calculate total amount
      const totalAmount = responseData.reduce((sum, item) => {
        const amount = activeReport === 'v_ca' ? item.total_amount :
                      activeReport === 'vlistRecharge' ? item.amount :
                      activeReport === 'vcadet_bo' ? item.price : 0;
        return sum + (parseFloat(amount) || 0);
      }, 0);

      // Format date range
      const startDate = new Date(dateFilter.start).toLocaleDateString();
      const endDate = new Date(dateFilter.end).toLocaleDateString();
      const period = `${startDate} - ${endDate}`;

      // Return summary table
      return {
      columns: [
          { key: 'period', label: 'Period' },
          { key: 'total', label: 'Total Amount' }
        ],
        rows: [{
          period: period,
          total: totalAmount.toFixed(2)
        }]
      };
    }

    // Get column mapping for current report
    const currentMapping = columnMappings[report.id] || [];
    
    // Process the data
    const formattedData = responseData.map(item => {
        const rowData = {};
        try {
            // Map each field according to the report's column mapping
            currentMapping.forEach(({ key, label }) => {
                const value = item[key];
                
                // vca_frn: handle number and date formatting like v_ca
                if (activeReport === 'vca_frn') {
                    if (key === 'expr1' && typeof value === 'number') {
                        rowData[key] = value.toFixed(2);
                        rowData['Amount'] = parseFloat(value.toFixed(2));
                        return;
                    }
                    if (key === 'delivery_note_date') {
                        rowData[key] = value ? new Date(value).toLocaleString() : '';
                        rowData['Delivery Note Date'] = value ? new Date(value).toLocaleString() : '';
                        return;
                    }
                }
                // v_ca: handle number and date formatting
                if (activeReport === 'v_ca') {
                    if (key === 'total_amount' && typeof value === 'number') {
                        const formattedValue = value.toFixed(2);
                        rowData[key] = formattedValue;
                        rowData['Total Amount'] = parseFloat(formattedValue);
                        return;
                    }
                    if (key.includes('date')) {
                        rowData[key] = value ? new Date(value).toLocaleString() : '';
                        return;
                    }
                }
                // Format numbers
                if (typeof value === 'number') {
                    rowData[key] = value.toString();
                    return;
                }
                // Handle null values
                if (value === null) {
                    rowData[key] = '';
                    return;
                }
                // Format boolean
                if (typeof value === 'boolean') {
                    rowData[key] = value ? 'Yes' : 'No';
                    return;
                }
                // Default string handling
                rowData[key] = value || '';
            });
            // vca_frn: add visualization fields for DataVisualizer
            if (activeReport === 'vca_frn') {
                if (item.stock_supplier_id) {
                    rowData['Supplier ID'] = item.stock_supplier_id;
                }
                if (item.stock_supplier_id_lookup) {
                    rowData['Supplier Lookup'] = item.stock_supplier_id_lookup;
                }
                if (item.article) {
                    rowData['Article'] = item.article;
                }
                if (typeof item.expr1 === 'number') {
                    rowData['Amount'] = item.expr1;
                }
                if (item.delivery_note_date) {
                    rowData['Delivery Note Date'] = new Date(item.delivery_note_date).toLocaleString();
                }
            }
            // Add Shop dimension for visualization
            if (item.shops) {
                rowData['Shop'] = item.shops;
            }

            // Add Client dimension for visualization
            if (item.client) {
                rowData['Client'] = item.client;
            }

            // Update processResponseData to handle vRecharge visualization
            if (activeReport === 'vRecharge') {
                // Add visualization fields for recharge data
                if (item._id) {
                    rowData['Internal ID'] = item._id.toString();
                }
                if (item.id) {
                    rowData['ID'] = item.id.toString();
                }
                if (item.recharge) {
                    rowData['Recharge'] = item.recharge;
                }
                if (typeof item.qte === 'number') {
                    rowData['Quantity'] = item.qte;
                }
                // Map date_heure to Transaction Date
                if (item.date_heure) {
                    const formattedDateTime = new Date(item.date_heure).toLocaleString();
                    rowData['transaction_date'] = formattedDateTime;
                    rowData['Transaction Date'] = formattedDateTime;
                }
                if (item.card_num) {
                    rowData['Card Number'] = item.card_num.toString();
                }
                if (item.client) {
                    rowData['Client'] = item.client;
                }
                if (item.code) {
                    rowData['Code'] = item.code.toString();
                }
                if (item.num_ticket) {
                    rowData['Ticket Number'] = item.num_ticket.toString();
                }
                if (item.caissier) {
                    rowData['Cashier'] = item.caissier;
                }
            }

            // vcadet_all: force date fields to be formatted for display, for both raw and display keys
            if (activeReport === 'vcadet_all') {
                if (item.trans_date) {
                    const formattedTransDate = new Date(item.trans_date).toLocaleString();
                    rowData['Transaction Date'] = formattedTransDate;
                    rowData['trans_date'] = formattedTransDate;
                }
                if (item.bookkeeping_date) {
                    const formattedBookDate = new Date(item.bookkeeping_date).toLocaleString();
                    rowData['Bookkeeping Date'] = formattedBookDate;
                    rowData['bookkeeping_date'] = formattedBookDate;
                }
            }

            // vliste_transac: map and format fields for display, inspired by v_ca
            if (activeReport === 'vliste_transac') {
                if (item.id) {
                    rowData['ID'] = item.id.toString();
                }
                if (item.transaction_number) {
                    rowData['Transaction Number'] = item.transaction_number.toString();
                }
                if (item.date) {
                    const formattedDate = new Date(item.date).toLocaleString();
                    rowData['Transaction Date'] = formattedDate;
                    rowData['date'] = formattedDate;
                }
                if (typeof item.total_transactions_initial === 'number') {
                    const formattedValue = item.total_transactions_initial.toFixed(2);
                    rowData['Total Amount'] = parseFloat(formattedValue);
                    rowData['total_transactions_initial'] = formattedValue;
                }
                if (item.shops) {
                    rowData['Shop'] = item.shops;
                }
                if (typeof item.quantite === 'number') {
                    const formattedValue = item.quantite.toFixed(2);
                    rowData['Quantity'] = parseFloat(formattedValue);
                    rowData['quantite'] = formattedValue;
                }
                if (typeof item.prix === 'number') {
                    const formattedValue = item.prix.toFixed(2);
                    rowData['Unit Price'] = parseFloat(formattedValue);
                    rowData['prix'] = formattedValue;
                }
                if (item.article) {
                    rowData['Article'] = item.article;
                }
                if (item.client) {
                    rowData['Client'] = item.client;
                }
                if (item.matricule) {
                    rowData['Matricule'] = item.matricule;
                }
                if (typeof item.paiement_transaction_initial === 'number') {
                    const formattedValue = item.paiement_transaction_initial.toFixed(2);
                    rowData['Payment Amount'] = parseFloat(formattedValue);
                    rowData['paiement_transaction_initial'] = formattedValue;
                }
                if (typeof item.ancien_solde === 'number') {
                    rowData['Previous Balance'] = item.ancien_solde.toFixed(2);
                }
            }

            // vlistRecharge: map and format fields for display, inspired by v_ca
            if (activeReport === 'vlistRecharge') {
                if (item.id) {
                    rowData['ID'] = item.id.toString();
                }
                if (item.trans_num) {
                    rowData['Transaction Number'] = item.trans_num.toString();
                }
                if (item.till_id) {
                    rowData['Till ID'] = item.till_id.toString();
                }
                if (item.shop_id) {
                    rowData['Shop ID'] = item.shop_id.toString();
                }
                if (item.bookkeeping_date) {
                    const formattedBookDate = new Date(item.bookkeeping_date).toLocaleString();
                    rowData['Bookkeeping Date'] = formattedBookDate;
                    rowData['bookkeeping_date'] = formattedBookDate;
                }
                if (item.trans_date) {
                    const formattedTransDate = new Date(item.trans_date).toLocaleString();
                    rowData['Transaction Date'] = formattedTransDate;
                    rowData['trans_date'] = formattedTransDate;
                }
                if (item.delete_operator_id) {
                    rowData['Delete Operator ID'] = item.delete_operator_id;
                }
                if (item.payment_id) {
                    rowData['Payment ID'] = item.payment_id.toString();
                }
                if (typeof item.amount === 'number') {
                    const formattedValue = item.amount.toFixed(2);
                    rowData['Amount'] = parseFloat(formattedValue);
                    rowData['amount'] = formattedValue;
                }
                if (typeof item.is_prepayment === 'number') {
                    rowData['Is Prepayment'] = item.is_prepayment === 1 ? 'Yes' : 'No';
                }
                if (item.description) {
                    rowData['Description'] = item.description;
                }
                if (item.till) {
                    rowData['Till'] = item.till;
                }
                if (item.shop) {
                    rowData['Shop'] = item.shop;
                }
                if (item.ncompte) {
                    rowData['Account Number'] = item.ncompte.toString();
                }
                if (item.card_num) {
                    rowData['Card Number'] = item.card_num.toString();
                }
                if (item.code) {
                    rowData['Code'] = item.code.toString();
                }
                if (item.name) {
                    rowData['Name'] = item.name;
                }
                if (item.payment_note) {
                    rowData['Payment Note'] = item.payment_note;
                }
                if (item.digital_authorization_num) {
                    rowData['Digital Authorization'] = item.digital_authorization_num;
                }
                if (item.digital_payment_id) {
                    rowData['Digital Payment ID'] = item.digital_payment_id;
                }
            }

            // vcadet_bo: map and format fields for display, inspired by v_ca
            if (activeReport === 'vcadet_bo') {
                if (item.id) {
                    rowData['ID'] = item.id.toString();
                }
                if (item.trans_num) {
                    rowData['Transaction Number'] = item.trans_num.toString();
                }
                if (item.trans_date) {
                    const formattedTransDate = new Date(item.trans_date).toLocaleString();
                    rowData['Transaction Date'] = formattedTransDate;
                    rowData['trans_date'] = formattedTransDate;
                }
                if (item.bookkeeping_date) {
                    const formattedBookDate = new Date(item.bookkeeping_date).toLocaleString();
                    rowData['Bookkeeping Date'] = formattedBookDate;
                    rowData['bookkeeping_date'] = formattedBookDate;
                }
                if (item.shop) {
                    rowData['Shop'] = item.shop;
                }
                if (item.caisse) {
                    rowData['Caisse'] = item.caisse;
                }
                if (typeof item.qty_weight === 'number') {
                    const formattedValue = item.qty_weight.toFixed(2);
                    rowData['Quantity/Weight'] = parseFloat(formattedValue);
                    rowData['qty_weight'] = formattedValue;
                }
                if (typeof item.price === 'number') {
                    const formattedValue = item.price.toFixed(2);
                    rowData['Price'] = parseFloat(formattedValue);
                    rowData['price'] = formattedValue;
                }
                if (item.articles) {
                    rowData['Articles'] = item.articles;
                }
                if (item.code) {
                    rowData['Code'] = item.code.toString();
                }
                if (item.card_num) {
                    rowData['Card Number'] = item.card_num.toString();
                }
                if (item.name) {
                    rowData['Customer Name'] = item.name;
                }
                if (item.operator) {
                    rowData['Operator'] = item.operator;
                }
                if (item.payement) {
                    rowData['Payment Method'] = item.payement;
                }
            }

        } catch (error) {
            console.error('Error formatting item:', error);
            currentMapping.forEach(({ key }) => {
                rowData[key] = '';
            });
        }
        return rowData;
    });

    // Sort the data by date
    formattedData.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });

    // Get unique articles and create metric names
    const uniqueArticles = [...new Set(formattedData
      .map(item => item.Article)
      .filter(Boolean)
      .map(article => `Article: ${article}`))];

    // Return the processed data with visualization settings
    if (activeReport === 'vRecharge') {
        return {
            columns: currentMapping,
            rows: formattedData,
            defaultDimension: 'Transaction Date',
            availableMetrics: [
                'Quantity',
                'Recharge'
            ],
            availableDimensions: [
        'Transaction Date',
                'Client',
                'Recharge',
                'Cashier'
            ]
        };
    } else if (activeReport === 'vcadet_bo') {
        return {
            columns: currentMapping,
            rows: formattedData,
            defaultDimension: 'Transaction Date',
            availableMetrics: [
                'Price',
                'Quantity/Weight'
            ],
            availableDimensions: [
                'Transaction Date',
                'Shop',
                'Articles',
                'Customer Name',
                'Payment Method'
            ]
        };
    } else {
        return {
            columns: currentMapping,
            rows: formattedData,
            // Add visualization configuration
            defaultDimension: 'Transaction Date',
            availableMetrics: [
        'Total Amount',
                'Unit Price',
                'Quantity',
                'Payment Amount',
                ...uniqueArticles  // Add all unique articles as metrics with proper prefix
            ],
            availableDimensions: [
                'Transaction Date',
                'Shop',
                'Article',
                'Client'
            ]
        };
    }
  }, [activeReport, columnMappings, reports, showTotalOnly, filters]);

  // Get current report config
  const currentReport = useMemo(() => 
    reports.find(r => r.id === activeReport) || null, 
    [reports, activeReport]
  );

  // Group filters by category for better organization
  const groupedFilters = useMemo(() => {
    if (!currentReport?.filters) return {};
    
    // Define filter categories for each report type
    const filterCategories = {
      v_ca: {
        dates: ['trans_date_range', 'bookkeeping_date_range'],
        main: ['trans_num', 'shop', 'caisse', 'code'],
        additional: ['card_num', 'payments', 'operator']
      },
      vca_frn: {
        dates: ['delivery_note_date_range'],
        main: ['stock_supplier_id', 'stock_supplier_id_lookup'],
        additional: []
      },
      vcadet_all: {
        dates: ['trans_date_range', 'bookkeeping_date_range'],
        main: ['trans_num', 'shop', 'caisse', 'code'],
        additional: ['qty_weight', 'operator', 'payement']
      },
      vliste_transac: {
        dates: ['date_range'],
        main: ['transaction_number', 'shops', 'article'],
        additional: ['client', 'matricule']
      },
      vlistRecharge: {
        dates: ['trans_date_range', 'bookkeeping_date_range'],
        main: ['trans_num', 'till_id', 'till', 'payment_id'],
        additional: ['is_prepayment', 'description', 'ncompte', 'code', 'name', 'card_num']
      },
      vRecharge: {
        dates: ['date_range'],
        main: ['id', 'recharge', 'client', 'code'],
        additional: ['num_ticket', 'caissier']
      },
      vcadet_bo: {
        dates: ['trans_date_range', 'bookkeeping_date_range'],
        main: ['trans_num', 'shop', 'caisse', 'articles'],
        additional: ['code', 'operator', 'payement']
    }
    };

    const categories = filterCategories[currentReport.id] || {
      dates: currentReport.filters.filter(f => f.type === 'date-range').map(f => f.id),
      main: currentReport.filters.filter(f => !f.type.includes('date-range')).slice(0, 4).map(f => f.id),
      additional: currentReport.filters.filter(f => !f.type.includes('date-range')).slice(4).map(f => f.id)
    };

    return {
      dates: currentReport.filters.filter(f => categories.dates.includes(f.id)),
      main: currentReport.filters.filter(f => categories.main.includes(f.id)),
      additional: currentReport.filters.filter(f => categories.additional.includes(f.id))
    };
  }, [currentReport]);

  /**
   * Handle filter changes
   * 
   * This function updates the filters state with new values and determines
   * if the Generate Report button should be enabled based on whether at least
   * one filter has a valid value. For text filters, it automatically converts
   * values to uppercase for consistency with the database.
   * 
   * @param {string} filterId - The ID of the filter being changed
   * @param {any} value - The new value for the filter
   */
  const handleFilterChange = (filterId, value) => {
    let processedValue = value;
    
    // Special handling for date ranges
    if (filterId.includes('date_range')) {
        processedValue = value;
    } else if (filterId === 'trans_num') {
        processedValue = value === '' ? '' : Number(value);
    } else if (typeof value === 'string') {
        // Convert to uppercase for specific fields
        if (['shop', 'caisse', 'articles', 'operator', 'payement', 'stock_supplier_id_lookup'].includes(filterId)) {
        processedValue = value.toUpperCase();
        } else if (filterId === 'card_num') {
            // Don't convert card numbers to uppercase
            processedValue = value;
        } else {
            processedValue = value;
      }
    }
    
    const updatedFilters = {
      ...filters,
        [filterId]: processedValue || processedValue === 0 ? processedValue : undefined
    };
    
    // Clean up empty values
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] === undefined || updatedFilters[key] === '') {
        delete updatedFilters[key];
      }
    });
    
    setFilters(updatedFilters);
    
    // Check if any filter has a valid value
    const hasActiveFilter = Object.entries(updatedFilters).some(([key, val]) => {
        if (key.includes('date_range') && typeof val === 'object') {
        return val.start || val.end;
      }
      if (typeof val === 'string' && val.trim() !== '') {
        return true;
      }
        if (typeof val === 'number' && !isNaN(val)) {
            return true;
        }
      return false;
    });
    
    setIsGenerateEnabled(hasActiveFilter);
    console.log('Current filters:', updatedFilters, 'Button enabled:', hasActiveFilter);
  };

  // Handle date change with validation
  const handleDateChange = (date, type, dateType) => {
    const filterKey = dateType === 'date' ? 'date_range' : `${dateType}_date_range`;
    const currentDateRange = filters[filterKey] || {};
    
    // Format the date for display and API
    let formattedDate = null;
    if (date) {
      const dateObj = new Date(date);
      if (activeReport === 'vliste_transac') {
        // For vliste_transac, store the full ISO string
        formattedDate = dateObj.toISOString();
      } else if (activeReport === 'vRecharge') {
        // For vRecharge, format as YYYY-MM-DD for display and API
        formattedDate = dateObj.toISOString().split('T')[0];
      } else {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }
    
    const newDateRange = {
      ...currentDateRange,
      [type]: formattedDate
    };
    
    // Update the filters state
    setFilters(prev => ({
      ...prev,
      [filterKey]: newDateRange
    }));
    
    // Enable generate button if at least one date is set
    setIsGenerateEnabled(true);
  };

  // Update fetchReportData to handle vliste_transac date format
  const fetchReportData = async () => {
    if (!isGenerateEnabled || !activeReport) return;
  
    setIsLoading(true);
    try {
        // Get current report configuration
        const report = reports.find(r => r.id === activeReport);
        if (!report) {
            throw new Error('Report configuration not found');
        }

      // Prepare clean API parameters from filters
      const apiParams = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === '') return;
  
            // Handle date range filters
            if (key.includes('date_range') && typeof value === 'object') {
                if (activeReport === 'vliste_transac') {
                    // Handle vliste_transac date format
                    if (value.start) {
                        const startDate = new Date(value.start);
                        startDate.setHours(0, 0, 0, 0);
                        apiParams['start_date'] = startDate.toISOString().replace('Z', '+00:00');
                    }
                    if (value.end) {
                        const endDate = new Date(value.end);
                        endDate.setHours(23, 59, 59, 999);
                        apiParams['end_date'] = endDate.toISOString().replace('Z', '+00:00');
                    }
                } else if (activeReport === 'vlistRecharge') {
                    // Handle vlistRecharge date format
                    if (value.start) {
                        const startDate = new Date(value.start);
                        startDate.setHours(0, 0, 0, 0);
                        apiParams['trans_start_date'] = startDate.toISOString().replace('Z', '+00:00');
                    }
                    if (value.end) {
                        const endDate = new Date(value.end);
                        endDate.setHours(23, 59, 59, 999);
                        apiParams['trans_end_date'] = endDate.toISOString().replace('Z', '+00:00');
                    }
                } else if (activeReport === 'vRecharge') {
                    // Handle vRecharge date format - keep same format as other reports
                    if (value.start) {
                        const startDate = new Date(value.start);
                        startDate.setHours(0, 0, 0, 0);
                        apiParams['start_date'] = startDate.toISOString().replace('Z', '+00:00');
                    }
                    if (value.end) {
                        const endDate = new Date(value.end);
                        endDate.setHours(23, 59, 59, 999);
                        apiParams['end_date'] = endDate.toISOString().replace('Z', '+00:00');
                    }
                } else {
                    const dateType = key.includes('bookkeeping') ? 'bookkeeping' : 
                                    key.includes('delivery_note') ? 'delivery_note' : 'trans';
                    
                    if (value.start) {
                        const startDate = new Date(value.start);
                        startDate.setHours(0, 0, 0, 0);
                        apiParams[`${dateType}_start_date`] = startDate.toISOString().replace('Z', '+00:00');
                    }
                    if (value.end) {
                        const endDate = new Date(value.end);
                        endDate.setHours(23, 59, 59, 999);
                        apiParams[`${dateType}_end_date`] = endDate.toISOString().replace('Z', '+00:00');
                    }
                }
        } else {
          apiParams[key] = value;
        }
      });
  
      // Clean empty/null fields
      Object.keys(apiParams).forEach((k) => {
            if (apiParams[k] === '' || apiParams[k] === null || apiParams[k] === undefined) {
          delete apiParams[k];
        }
      });
  
      // If no valid params, prevent request
      if (Object.keys(apiParams).length === 0) {
        alert('No valid filters were provided. Please enter at least one valid value.');
        setIsLoading(false);
        return;
      }
  
      console.log('📡 Fetching with:', JSON.stringify(apiParams, null, 2));
  
      try {
            // Create axios instance with direct API config
        const axiosInstance = axios.create({
                    baseURL: 'https://students.aui.ma/api',
                    timeout: 60000,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
  
            // Make the API call with the correct endpoint
            const response = await axiosInstance.post(report.endpoint, apiParams);
  
        if (!response.data) {
          throw new Error('No data received from server');
        }
  
            // Process the response data using memoized function
            const processedData = processResponseData(response.data);
            setReportData(processedData);
  
            if (response.data.length === 0) {
                alert('No data found matching your filter criteria. Please try different filters.');
        }
        addNotification(`Report "${report.name}" loaded successfully.`, 'info');
      } catch (error) {
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        addNotification(`Error loading report: ${error.message}`, 'error');
            throw error;
      }
    } catch (error) {
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
  
      let errorMessage = 'An error occurred while fetching data. ';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage += 'Please check your input values.';
            break;
          case 401:
            errorMessage += 'Authentication required.';
            break;
          case 403:
            errorMessage += 'Access denied.';
            break;
          case 404:
            errorMessage += 'The requested resource was not found.';
            break;
          case 500:
            errorMessage += 'Server error. Please try again later.';
            break;
          default:
            errorMessage += 'Please try again later.';
        }
      } else if (error.request) {
        errorMessage += 'No response received from server. Please check your connection.';
      }
  
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle row click
  const handleRowClick = (row, index) => {
    console.log(`Clicked row ${index}:`, row);
    // You could show a detail panel or modal here
  };

  // Load data when a report is selected
  useEffect(() => {
    if (!activeReport) return;
    
    // Reset filters and data only when changing reports, not when switching views
    setFilters({});
    setIsGenerateEnabled(false);
    setReportData({ 
      columns: reports.find(r => r.id === activeReport)?.columns || [],
      rows: [],
      defaultDimension: 'Transaction Date'
    });
    
  }, [activeReport, reports]); // Only depend on activeReport and reports

  // Handle view mode change - just switch the view without affecting data
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
  };

  // Add dark mode toggle function
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Remove unused defaultColumns warning by using it in the component
  const currentColumns = useMemo(() => {
    return defaultColumns.filter(col => activeColumns.includes(col.key));
  }, [defaultColumns, activeColumns]);

  useEffect(() => {
    if (reportData && reportData.columns && reportData.columns.length > 0) {
      setActiveColumns(reportData.columns.map(col => col.key));
    }
    // Only run when reportData.columns changes
    // eslint-disable-next-line
  }, [reportData.columns]);

  // Real-time search for reports
  useEffect(() => {
    if (!headerSearch.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const results = reports.filter(r =>
      r.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(headerSearch.toLowerCase())
    );
    setSearchResults(results);
    setShowSearchDropdown(true);
  }, [headerSearch, reports]);

  // Helper to add a notification
  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [
      { id: Date.now() + Math.random(), message, type, time: Date.now() },
      ...prev.slice(0, 19) // keep max 20
    ]);
  };

  // SETTINGS: persist theme and rowsPerPage in localStorage
  useEffect(() => {
    const savedRows = localStorage.getItem('rowsPerPage');
    if (savedRows) setDefaultRowsPerPage(Number(savedRows));
  }, []);
  useEffect(() => {
    localStorage.setItem('rowsPerPage', defaultRowsPerPage);
  }, [defaultRowsPerPage]);
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // NOTIFICATIONS: persist in localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  // Multi-select options for v_ca
  const vcaShopOptions = [
    "AUI PROXI", "AUI COSSA", "AUI BUSINESS OFFICE", "AUI SHOP"
  ];
  const vcaCaisseOptions = [
    "CAISSE L'INSTANT", "FAST FOOD", "SAO", "CAISSE SUPERETTE", "KIOSQUE BLDG 4", "CAISSE LAUNDRY", "L'INTERNATIONAL", "CAISSE GRILL", "CAISSE BOUTIQUE", "PIZZERIA", "FACULTY ROOM", "LE PLAT", "CAISSE B.O RIGHT", "KIOSQUE BLDG 39", "CAISSE B.O LEFT", "CAISSE FACULTY CLUB", "CAISSE SUPERETTE 2"
  ];
  const vcaOperatorOptions = [
    "SAO", "MARIA SOUAF", "ZAKARIA SLAOUI", "HASSAN JEBBARI FC", "PIZZERIA", "NASSIRA BOUHAYADI", "YOUSSEF LAASRI", "ZINEB BARBACHE", "LAMIAE OUJILLALI", "GOURMET SELF", "KHADIJA BAJJA", "MERIEM LAKSIBI", "L'INSTANT", "Marouane Khalef", "FATIMA BAKHOUCHI", "KIOSQUE GRILL", "KIOSKE L INSTANT", "SALAHEDDINE B.O", "GRILL", "HAMZAOUI MILOUDA-36", "Amina Wahid", "Omar Naciri", "FACULTY ROOM", "AMINE ITTO - 39", "NISSRINE TBATOU", "SOUKAINA TAHIRI ALAOUI", "NADIA BOUCHANINE", "SABRI MAJDA- 36", "TCPOS Supervisor", "HASSAN JBBARI"
  ];
  const vcaPaymentOptions = [
    "CHEQUES", "Carte de crédit TPE", "WALLET", "ESPECES", "VIREMENT"
  ];

  // Multi-select options for vcadet_all
  const vcadetAllShopOptions = [
    "AUI PROXI", "AUI COSSA", "AUI BUSINESS OFFICE", "AUI SHOP"
  ];
  const vcadetAllCaisseOptions = [
    "CAISSE L'INSTANT", "FAST FOOD", "SAO", "CAISSE SUPERETTE", "KIOSQUE BLDG 4", "CAISSE LAUNDRY", "L'INTERNATIONAL", "CAISSE GRILL", "CAISSE BOUTIQUE", "PIZZERIA", "FACULTY ROOM", "LE PLAT", "CAISSE B.O RIGHT", "KIOSQUE BLDG 39", "CAISSE B.O LEFT", "CAISSE FACULTY CLUB", "CAISSE SUPERETTE 2"
  ];
  const vcadetAllOperatorOptions = [
    "SAO", "MARIA SOUAF", "ZAKARIA SLAOUI", "HASSAN JEBBARI FC", "PIZZERIA", "YOUSSEF LAASRI", "NASSIRA BOUHAYADI", "ZINEB BARBACHE", "LAMIAE OUJILLALI", "GOURMET SELF", "KHADIJA BAJJA", "MERIEM LAKSIBI", "L'INSTANT", "Marouane Khalef", "FATIMA BAKHOUCHI", "KIOSQUE GRILL", "KIOSKE L INSTANT", "SALAHEDDINE B.O", "GRILL", "HAMZAOUI MILOUDA-36", "Amina Wahid", "Omar Naciri", "FACULTY ROOM", "AMINE ITTO - 39", "NISSRINE TBATOU", "SOUKAINA TAHIRI ALAOUI", "NADIA BOUCHANINE", "SABRI MAJDA- 36", "TCPOS Supervisor", "HASSAN JBBARI"
  ];
  const vcadetAllPaymentOptions = [
    "CHEQUES", "Carte de crédit TPE", "WALLET", "ESPECES", "VIREMENT"
  ];

  // Multi-select options for vcadet_bo
  const vcadetBoCaisseOptions = [
    "SAO", "CAISSE B.O RIGHT", "CAISSE B.O LEFT", "CAISSE LAUNDRY", "CAISSE FACULTY CLUB"
  ];
  const vcadetBoOperatorOptions = [
    "SAO", "HAMZAOUI MILOUDA-36", "AMINE ITTO - 39", "ZINEB BARBACHE", "SOUKAINA TAHIRI ALAOUI", "NADIA BOUCHANINE", "SABRI MAJDA- 36", "TCPOS Supervisor", "HASSAN JBBARI", "SALAHEDDINE B.O"
  ];
  const vcadetBoPaymentOptions = [
    "CHEQUES", "Carte de crédit TPE", "WALLET", "ESPECES", "VIREMENT"
  ];

  // Multi-select options for vliste_transac
  const vlisteTransacShopOptions = [
    "AUI PROXI", "AUI COSSA", "AUI BUSINESS OFFICE", "AUI SHOP"
  ];

  // Multi-select options for vRecharge
  const vRechargeCaisseOptions = [
    "Amina Wahid", "Omar Naciri", "TCPOS Supervisor", "Marouane Khalef"
  ];

  // Multi-select options for vlistRecharge
  const vlistRechargeTillOptions = [
    "CAISSE WEB SERVICE", "CAISSE B.O RIGHT", "CAISSE B.O LEFT"
  ];

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
        {/* Sidebar */}
      <div 
          className={`${isMobileMenuOpen ? 'fixed inset-0 z-40 transform translate-x-0' : 'hidden md:block -translate-x-full md:translate-x-0'} 
            md:w-64 md:relative transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700`}
      >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-primary-600 dark:bg-gray-900">
          <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center transform hover:scale-105 transition-transform duration-200 shadow-lg">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">TR</span>
            </div>
              <h1 className="text-xl font-bold text-white ml-3 tracking-tight">AUI Reports</h1>
          </div>
          <button 
              className="relative p-2 w-10 h-10 rounded-lg bg-background-secondary dark:bg-background-primary
                hover:ring-2 ring-accent/20 transition-all duration-300 ease-in-out group
                hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-accent/50"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              role="switch"
              aria-checked={isDarkMode}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
                <div className="relative w-5 h-5">
                  <Sun 
                    size={20} 
                    className={`absolute inset-0 text-accent transition-all duration-300 ${
                      isDarkMode ? 'opacity-0 rotate-0 scale-0' : 'opacity-100 rotate-180 scale-100'
                    }`}
                  />
                  <Moon 
                    size={20} 
                    className={`absolute inset-0 text-accent transition-all duration-300 ${
                      isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                    }`}
                  />
                </div>
              </div>
              <span className="sr-only">{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
          </button>
        </div>
        
          {/* Rest of the sidebar content */}
          <div className="px-3 py-3 overflow-y-auto">
            <div className="mb-1 px-3 py-2 text-primary-600 dark:text-primary-400 font-medium text-sm uppercase tracking-wider">Reports</div>
          <nav>
              <ul className="space-y-1">
              {reports.map((report) => (
                <li key={report.id}>
                  <button
                      className={`w-full text-left px-3 py-2.5 flex items-center rounded-lg transition-all duration-200 transform hover:translate-x-1 ${
                      activeReport === report.id 
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => {
                      setActiveReport(report.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                      <span className={`mr-3 transition-transform duration-200 transform group-hover:scale-110 ${
                        activeReport === report.id 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {report.icon}
                      </span>
                    <span className="font-medium">{report.name}</span>
                      <ChevronRight 
                        size={16} 
                        className={`ml-auto transition-transform duration-200 ${
                          activeReport === report.id 
                            ? 'rotate-90 text-primary-600 dark:text-primary-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} 
                      />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Top Navigation */}
          <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 transition-all duration-300">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
                className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 ml-4 mr-auto flex">
              <div className="relative max-w-xl w-full">
                <input
                  type="text"
                  placeholder="Search reports or data..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg \
                    bg-gray-50 dark:bg-dark-800 \
                    border border-gray-200 dark:border-dark-600\
                    text-gray-900 dark:text-gray-100\
                    focus:outline-none focus:ring-2 \
                    focus:ring-primary-500 dark:focus:ring-primary-400\
                    focus:border-primary-500 dark:focus:border-primary-400\
                    placeholder-gray-500 dark:placeholder-gray-400\
                    transition-all duration-200"
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400 dark:text-gray-500" />
                </div>
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map(r => (
                      <button
                        key={r.id}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onClick={() => {
                          setActiveReport(r.id);
                          setHeaderSearch('');
                          setShowSearchDropdown(false);
                        }}
                      >
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{r.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
              {/* User Actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative" onClick={() => setShowNotifications(v => !v)}>
                <Bell size={20} />
                  {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-gray-500 text-sm">No notifications</div>
                        ) : notifications.map((n, i) => (
                          <div key={n.id} className={`flex justify-between items-center p-3 border-b last:border-b-0 text-sm ${n.type === 'error' ? 'text-red-600' : 'text-gray-700 dark:text-gray-200'}`}>
                            <span>
                              <span className="font-bold mr-2">[{n.type.toUpperCase()}]</span>
                              {n.message}
                              <span className="ml-2 text-xs text-gray-400">{n.time ? new Date(n.time).toLocaleTimeString() : ''}</span>
                            </span>
                            <button className="ml-2 text-gray-400 hover:text-red-600" onClick={() => setNotifications(notifications.filter((_, idx) => idx !== i))}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-t" onClick={() => setNotifications([])}>Clear All</button>
                    </div>
                  )}
              </button>
              
                {/* Settings */}
                <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors" onClick={() => setIsSettingsOpen(true)}>
                  <Sliders size={20} />
                </button>

                {/* User Profile / Auth */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 
                      transition-colors"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        {user && user.name ? getInitials(user.name) : ''}
                      </span>
                </div>
                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700">
                      {/* Full name above sign out */}
                      <div className="px-4 py-2 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-200 dark:border-dark-700">
                        {user && user.name}
                </div>
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center"
                        onClick={logout}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
<main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="hover:text-gray-700 cursor-pointer">Dashboard</span>
            {activeReport && (
              <>
                <ChevronRight size={16} className="mx-1" />
                <span className="text-gray-700 font-medium">
                  {currentReport?.name}
                </span>
              </>
            )}
          </div>
        
          {/* Page header with view toggle */}
          <div className="mb-6 flex justify-between items-center">
            <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeReport ? currentReport?.name : 'Dashboard Overview'}
              </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
                {activeReport 
                  ? currentReport?.description 
                  : 'Select a report from the sidebar to view detailed data'}
              </p>
            </div>
            
    {/* Add Column Manager Button next to the view toggle */}
            {activeReport && (
      <div className="flex items-center space-x-4">
              <div className="flex border rounded-md overflow-hidden">
                <button 
            className={`flex items-center px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => handleViewModeChange('table')}
                >
                  <Grid size={16} className="mr-2" />
                  <span>Table</span>
                </button>
                <button 
            className={`flex items-center px-3 py-2 ${viewMode === 'visualization' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}
            onClick={() => handleViewModeChange('visualization')}
                >
                  <BarChart2 size={16} className="mr-2" />
                  <span>Visualize</span>
                </button>
        </div>

        {viewMode === 'table' && (
          <button
            className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsColumnManagerOpen(true)}
          >
            <Columns size={16} className="mr-2" />
            <span>Manage Columns</span>
          </button>
        )}
              </div>
            )}
          </div>
          
  {/* Filters - Only show when a report is active */}
  {activeReport && currentReport?.filters && (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 border border-gray-100 dark:border-gray-700 
      transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
      {/* Date Filters Section */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Date Filters</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedFilters.dates.map((filter) => (
            <div key={filter.id} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {filter.label}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg
                      bg-gray-50 dark:bg-dark-800 
                      border border-gray-200 dark:border-dark-600
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 
                      focus:ring-primary-500 dark:focus:ring-primary-400
                      focus:border-primary-500 dark:border-primary-400
                      placeholder-gray-500 dark:placeholder-gray-400
                      transition-all duration-200"
                    value={
                      activeReport === 'vRecharge'
                        ? (filters[filter.id]?.start ? new Date(filters[filter.id].start).toISOString().split('T')[0] : '')
                        : (activeReport === 'vliste_transac'
                          ? (filters[filter.id]?.start ? new Date(filters[filter.id].start).toISOString().split('T')[0] : '')
                          : (filters[filter.id]?.start || ''))
                    }
                    onChange={(e) => handleDateChange(
                      e.target.value,
                      'start',
                      filter.id.includes('bookkeeping') ? 'bookkeeping' : 
                      filter.id.includes('delivery_note') ? 'delivery_note' : 
                      activeReport === 'vliste_transac' ? 'date' : 'trans'
                    )}
                    placeholder="Start date"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg
                      bg-gray-50 dark:bg-dark-800 
                      border border-gray-200 dark:border-dark-600
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 
                      focus:ring-primary-500 dark:focus:ring-primary-400
                      focus:border-primary-500 dark:border-primary-400
                      placeholder-gray-500 dark:placeholder-gray-400
                      transition-all duration-200"
                    value={
                      activeReport === 'vRecharge'
                        ? (filters[filter.id]?.end ? new Date(filters[filter.id].end).toISOString().split('T')[0] : '')
                        : (activeReport === 'vliste_transac'
                          ? (filters[filter.id]?.end ? new Date(filters[filter.id].end).toISOString().split('T')[0] : '')
                          : (filters[filter.id]?.end || ''))
                    }
                    onChange={(e) => handleDateChange(
                      e.target.value,
                      'end',
                      filter.id.includes('bookkeeping') ? 'bookkeeping' : 
                      filter.id.includes('delivery_note') ? 'delivery_note' : 
                      activeReport === 'vliste_transac' ? 'date' : 'trans'
                    )}
                    placeholder="End date"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {/* Place the checkbox here, after the date filter grid */}
        {(activeReport === 'v_ca' || activeReport === 'vlistRecharge' || activeReport === 'vcadet_bo') && (
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="show-total-only"
              className="mr-2"
              checked={showTotalOnly}
              onChange={e => setShowTotalOnly(e.target.checked)}
              disabled={
                !groupedFilters.dates.some(f => filters[f.id]?.start && filters[f.id]?.end)
              }
            />
            <label htmlFor="show-total-only" className="text-sm text-gray-700 dark:text-gray-300 select-none">
              Show only total amount for selected period
            </label>
            </div>
          )}
      </div>
      
      {/* Main Filters Section */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Main Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groupedFilters.main.map((filter) => (
            <div key={filter.id} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>
              <div className="relative">
                <input
                  type={filter.type === 'number' ? 'number' : 'text'}
                  className="w-full px-3 py-2 rounded-lg
                    bg-gray-50 dark:bg-dark-800 
                    border border-gray-200 dark:border-dark-600
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 
                    focus:ring-primary-500 dark:focus:ring-primary-400
                    focus:border-primary-500 dark:focus:border-primary-400
                    placeholder-gray-500 dark:placeholder-gray-400
                    transition-all duration-200"
                  placeholder={filter.placeholder}
                  value={filters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Filters Section */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Additional Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedFilters.additional.map((filter) => (
            <div key={filter.id} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg
                    bg-gray-50 dark:bg-dark-800 
                    border border-gray-200 dark:border-dark-600
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 
                    focus:ring-primary-500 dark:focus:ring-primary-400
                    focus:border-primary-500 dark:focus:border-primary-400
                    placeholder-gray-500 dark:placeholder-gray-400
                    transition-all duration-200"
                  placeholder={filter.placeholder}
                  value={filters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-b-2xl transition-colors duration-300">
        <div className="flex flex-wrap gap-3 justify-end">
                    <button 
            className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center transform hover:scale-105 hover:shadow-md"
                      onClick={() => {
                        setFilters({});
                        setIsGenerateEnabled(false);
                        setReportData({ columns: [], rows: [] });
                      }}
                    >
            <RefreshCw size={18} className="mr-2" />
            Reset Filters
                    </button>
                    <button 
            className={`px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 shadow-md flex items-center transform hover:scale-105 ${isGenerateEnabled ? 'bg-green-600 hover:bg-green-700 hover:shadow-xl' : 'bg-gray-300 cursor-not-allowed'}`}
            style={{ minWidth: 140 }}
            onClick={fetchReportData}
            disabled={!isGenerateEnabled}
          >
            <BarChart2 size={18} className="mr-2" />
            Generate Report
                    </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold flex items-center ml-2 hover:bg-red-700 transition-all duration-200 shadow-md"
            onClick={() => {
              if (!reportData.rows || reportData.rows.length === 0) {
                setAnomalies([]);
                setHighlightedRows([]);
                setShowAnomalyModal(true);
                return;
              }
              const anomalies = [];
              const seenTrans = new Set();
              const values = reportData.rows.map(row => Number(row['Total Amount'] || row['Price'] || row['Amount'] || 0)).filter(v => !isNaN(v));
              const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
              const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length || 1));
              const highlightIdx = [];
              reportData.rows.forEach((row, idx) => {
                const val = Number(row['Total Amount'] || row['Price'] || row['Amount'] || 0);
                let isAnomaly = false;
                if (val < 0) { anomalies.push({ idx, reason: 'Negative value' }); isAnomaly = true; }
                if (Math.abs(val - mean) > 3 * std && values.length > 1) { anomalies.push({ idx, reason: 'Outlier' }); isAnomaly = true; }
                if (row['Transaction Number']) {
                  if (seenTrans.has(row['Transaction Number'])) { anomalies.push({ idx, reason: 'Duplicate transaction' }); isAnomaly = true; }
                  seenTrans.add(row['Transaction Number']);
                }
                if (isAnomaly) highlightIdx.push(idx);
              });
              setAnomalies(anomalies);
              setHighlightedRows(highlightIdx);
              setShowAnomalyModal(true);
            }}
            disabled={!reportData.rows || reportData.rows.length === 0}
          >
            <span className="mr-2">🔎</span> Detect Anomalies
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-blue-700 text-white font-semibold ml-2"
            onClick={() => {
              setCompareFilters({});
              setCompareData(null);
              setShowCompareModal(true);
            }}
          >
            Compare With...
          </button>
                            </div>
                              </div>
                            </div>
  )}
  
  {/* Column Manager Modal */}
  {isColumnManagerOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Manage Columns</h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setIsColumnManagerOpen(false)}
          >
            <X size={20} />
          </button>
                          </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">
            Select columns to display in the table
                        </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableColumns.map((column) => (
              <label
                key={column.key}
                className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer group"
              >
                          <input 
                  type="checkbox"
                  checked={activeColumns.includes(column.key)}
                  onChange={() => handleColumnToggle(column.key)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                  {column.label}
                </span>
              </label>
            ))}
          </div>
                </div>
                
        <div className="flex justify-between pt-4 border-t">
                  <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
            onClick={resetColumns}
          >
            <RefreshCw size={16} className="mr-2" />
            Reset to Default
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => setIsColumnManagerOpen(false)}
          >
            Done
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Report Content - Toggle between Table and Visualization */}
          {activeReport && (
    <div className="mt-6 animate-fadeIn">
              {viewMode === 'table' ? (
                <ReportTable 
          data={{
            columns: reportData.columns || [],
            rows: reportData.rows || [],
            reportName: currentReport?.name || '',
            filters: filters
          }}
                  isLoading={isLoading}
                  onRowClick={handleRowClick}
          activeColumns={activeColumns}
          addNotification={addNotification}
          highlightedRows={highlightedRows}
                />
              ) : (
                <DataVisualizer 
          reportData={reportData}
                  reportId={activeReport}
                />
              )}
            </div>
          )}
          
  {/* Landing Page Content */}
          {!activeReport && (
    <div className="space-y-6">
      {/* Quick Access Reports Grid */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quick Access Reports</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              <Settings size={20} />
            </button>
                </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setActiveReport(report.id)}
              className="flex items-start p-4 rounded-lg border border-gray-200 dark:border-dark-600 
                hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200 group"
                    >
              <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 
                group-hover:bg-primary-100 dark:group-hover:bg-primary-800/30 transition-colors">
                      {report.icon}
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{report.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.description}</p>
              </div>
                    </button>
                  ))}
                </div>
              </div>

      {/* Quick Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frequently Used Reports */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Frequently Used</h2>
          <div className="space-y-3">
            {reports.slice(0, 4).map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 
                  transition-colors group text-left"
              >
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 
                  group-hover:bg-primary-100 dark:group-hover:bg-primary-800/30">
                  {report.icon}
                </div>
                <span className="ml-3 font-medium text-gray-900 dark:text-gray-100">{report.name}</span>
                <ChevronRight 
                  size={16} 
                  className="ml-auto text-gray-400 dark:text-gray-500 group-hover:text-primary-500 
                    dark:group-hover:text-primary-400 transition-colors"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 
                dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
              onClick={() => {
                setActiveReport('v_ca');
                setViewMode('visualization');
              }}
            >
              <BarChart2 size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Sales Analytics</span>
            </button>
            <button 
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 
                dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
              onClick={() => {
                setActiveReport('vcadet_all');
                setViewMode('table');
              }}
            >
              <FileText size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Transaction Details</span>
            </button>
            <button 
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 
                dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
              onClick={() => {
                setActiveReport('vlistRecharge');
                setViewMode('table');
              }}
            >
              <CreditCard size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Recharges</span>
            </button>
            <button 
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 
                dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-200"
              onClick={() => {
                setActiveReport('vca_frn');
                setViewMode('table');
              }}
            >
              <Database size={24} className="text-primary-600 dark:text-primary-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Supplier Data</span>
            </button>
          </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>{/* End flex container */}
  </ThemeContext.Provider>
)}

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default EnhancedDashboard; 