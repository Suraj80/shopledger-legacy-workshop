'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var coupons = require('../lib/coupons');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

// Matches the item shape stored by routes/orders.js. All test data stays in memory.
function riceOrder(price, coupon) {
  var items = [{
    id: 1,
    sku: 'GRN-TEST',
    name: 'Test rice',
    hsn: '1006',
    price: price,
    qty: 1
  }];

  var billed = pricing.computeTotals(items, coupon || '');
  return {
    items: items,
    coupon: coupon || '',
    subtotal: billed.subtotal,
    discount: billed.discount,
    tax: billed.tax,
    total: billed.total
  };
}

test('invoice matches billed HSN GST and discounted coupon totals', function () {
  var order = riceOrder(1000, 'SAVE10');
  var billed = pricing.computeTotals(order.items, order.coupon);
  var invoiceFigures = invoice.computeInvoiceFigures(order);

  assert.deepEqual(
    {
      subtotal: invoiceFigures.subtotal,
      discount: invoiceFigures.discount,
      tax: invoiceFigures.tax,
      cgst: invoiceFigures.cgst,
      sgst: invoiceFigures.sgst,
      total: invoiceFigures.total,
      gstPercent: invoiceFigures.rows[0].gstPercent,
    },
    {
      subtotal: billed.subtotal,
      discount: billed.discount,
      tax: billed.tax,
      cgst: billed.cgst,
      sgst: billed.sgst,
      total: billed.total,
      gstPercent: billed.lines[0].gstPercent
    }
  );
});

test('invoice matches pricing when coupon is below its minimum subtotal', function () {
  var order = riceOrder(100, 'FLAT50');
  var billed = pricing.computeTotals(order.items, order.coupon);
  var invoiceFigures = invoice.computeInvoiceFigures(order);

  assert.equal(coupons.validate('FLAT50', order.subtotal).valid, false);
  assert.deepEqual(
    {
      subtotal: invoiceFigures.subtotal,
      discount: invoiceFigures.discount,
      tax: invoiceFigures.tax,
      cgst: invoiceFigures.cgst,
      sgst: invoiceFigures.sgst,
      total: invoiceFigures.total
    },
    {
      subtotal: billed.subtotal,
      discount: billed.discount,
      tax: billed.tax,
      cgst: billed.cgst,
      sgst: billed.sgst,
      total: billed.total
    }
  );
});

test('invoice matches pricing when percentage coupon reaches its maximum discount', function () {
  var order = riceOrder(3000, 'SAVE10');
  var billed = pricing.computeTotals(order.items, order.coupon);
  var invoiceFigures = invoice.computeInvoiceFigures(order);

  assert.deepEqual(
    { subtotal: invoiceFigures.subtotal, discount: invoiceFigures.discount, tax: invoiceFigures.tax, cgst: invoiceFigures.cgst, sgst: invoiceFigures.sgst, total: invoiceFigures.total },
    { subtotal: billed.subtotal, discount: billed.discount, tax: billed.tax, cgst: billed.cgst, sgst: billed.sgst, total: billed.total }
  );
});
