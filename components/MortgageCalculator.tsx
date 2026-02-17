"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

interface MortgageCalculatorProps {
  homePrice: number;
}

export default function MortgageCalculator({ homePrice }: MortgageCalculatorProps) {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const calculation = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    let monthlyPI: number;
    if (monthlyRate === 0) {
      monthlyPI = loanAmount / numPayments;
    } else {
      monthlyPI =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const monthlyTax = (homePrice * 0.012) / 12; // ~1.2% annual property tax
    const monthlyInsurance = (homePrice * 0.004) / 12; // ~0.4% annual insurance
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;

    return {
      downPayment,
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      totalMonthly,
    };
  }, [homePrice, downPaymentPct, interestRate, loanTerm]);

  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const piPct = (calculation.monthlyPI / calculation.totalMonthly) * 100;
  const taxPct = (calculation.monthlyTax / calculation.totalMonthly) * 100;
  const insPct = (calculation.monthlyInsurance / calculation.totalMonthly) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        Mortgage Calculator
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Down Payment: {downPaymentPct}% ({formatUSD(calculation.downPayment)})
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Loan Term</label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>30 years</option>
              <option value={20}>20 years</option>
              <option value={15}>15 years</option>
              <option value={10}>10 years</option>
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <p className="text-sm text-gray-600">Estimated Monthly Payment</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {formatUSD(calculation.totalMonthly)}
          </p>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-2">
          <div className="flex rounded-full overflow-hidden h-3">
            <div className="bg-blue-500" style={{ width: `${piPct}%` }} />
            <div className="bg-amber-400" style={{ width: `${taxPct}%` }} />
            <div className="bg-green-400" style={{ width: `${insPct}%` }} />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                Principal & Interest
              </span>
              <span className="font-medium">{formatUSD(calculation.monthlyPI)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                Property Tax
              </span>
              <span className="font-medium">{formatUSD(calculation.monthlyTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                Insurance
              </span>
              <span className="font-medium">{formatUSD(calculation.monthlyInsurance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
