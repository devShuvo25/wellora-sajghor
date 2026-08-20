import React from 'react';
import { DistributorOrder } from '../../types';

interface TrackingModalProps {
  order: DistributorOrder | null;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const steps = [
    { title: 'Order Created', desc: 'Received via ' + order.channel, done: true, time: order.date + ' • 10:30 AM' },
    { title: 'Verified by WELLORA Hub', desc: 'QR Authentic Tag checked', done: true, time: order.date + ' • 02:15 PM' },
    { title: 'In Transit', desc: 'Dispatched with Dhaka Express Courier', done: order.trackingStatus === 'In Transit' || order.trackingStatus === 'Delivered', time: 'In Progress' },
    { title: 'Delivered to Customer', desc: 'Cash collected upon delivery', done: order.trackingStatus === 'Delivered', time: order.trackingStatus === 'Delivered' ? 'Completed' : 'Pending' },
  ];

  return (
    <div
      id="tracking-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-wellora-on-background/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="tracking-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-wellora-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-wellora-outline-variant/40"
      >
        <div className="flex items-center justify-between pb-4 border-b border-wellora-outline-variant/30">
          <div>
            <span className="font-label-caps text-xs text-wellora-surface-tint font-bold">Order Tracking</span>
            <h3 className="font-headline-sm text-lg font-bold text-wellora-on-background">{order.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-wellora-surface-container-low text-wellora-on-background hover:bg-wellora-surface-container-high flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Customer Brief */}
        <div className="p-3.5 my-4 bg-wellora-background rounded-xl border border-wellora-outline-variant/30 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-wellora-on-surface-variant">Customer:</span>
            <span className="font-bold text-wellora-on-background">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-wellora-on-surface-variant">Phone:</span>
            <span className="font-mono text-wellora-on-background">{order.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-wellora-on-surface-variant">Address:</span>
            <span className="text-wellora-on-background max-w-[220px] text-right truncate">{order.deliveryAddress}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-wellora-outline-variant/20">
            <span className="text-wellora-on-surface-variant">Order Total:</span>
            <span className="font-bold text-wellora-surface-tint">৳ {order.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-wellora-on-surface-variant">Your Commission:</span>
            <span className="font-bold text-emerald-700">৳ {order.commission.toLocaleString()} ({order.commStatus})</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 py-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.done
                      ? 'bg-wellora-surface-tint text-wellora-on-primary'
                      : 'bg-wellora-surface-container-low text-wellora-on-surface-variant border border-wellora-outline-variant'
                  }`}
                >
                  {step.done ? <span className="material-symbols-outlined text-sm">check</span> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 my-0.5 ${
                      step.done ? 'bg-wellora-surface-tint' : 'bg-wellora-outline-variant'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="flex justify-between items-baseline">
                  <h4 className={`text-xs font-bold ${step.done ? 'text-wellora-on-background' : 'text-wellora-on-surface-variant'}`}>
                    {step.title}
                  </h4>
                  <span className="text-[10px] text-wellora-on-surface-variant">{step.time}</span>
                </div>
                <p className="text-[11px] text-wellora-on-surface-variant mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-wellora-surface-tint text-wellora-on-primary rounded-lg text-xs font-label-caps uppercase tracking-wider hover:bg-wellora-on-primary-fixed-variant transition-colors"
        >
          Close Tracking Details
        </button>
      </div>
    </div>
  );
};
