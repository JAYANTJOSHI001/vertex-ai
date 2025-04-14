import { useState, useEffect } from 'react';

const invoices = [
  { id: 'INV-001', date: '2023-10-31', amount: '$49.99', status: 'Paid' },
  { id: 'INV-002', date: '2023-09-30', amount: '$49.99', status: 'Paid' },
  { id: 'INV-003', date: '2023-08-31', amount: '$29.99', status: 'Paid' },
];

export default function BillingTab() {
  const [userPlan, setUserPlan] = useState({
    name: 'Pro Plan',
    price: '$49.99/month',
    features: [
      '50,000 API calls per month',
      'Access to all models',
      'Priority support'
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Error fetching billing info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingInfo();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading billing information...</div>;
  }

  return (
    <div className="space-y-6 text-black">
      <h2 className="text-2xl font-bold">Billing & Invoices</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">{userPlan.name}</p>
            <p className="text-gray-600">{userPlan.price}</p>
            <ul className="mt-2 text-sm text-gray-600">
              {userPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-4 w-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-indigo-800 transition">
            Upgrade Plan
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-md mr-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-gray-600">Expires 12/2025</p>
            </div>
          </div>
          <div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
          </div>
        </div>
        <button className="mt-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
          + Add Payment Method
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Invoice History</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}