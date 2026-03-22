// frontend/src/types.d.ts

interface ProductBatch {
  collectionId: string;
  herbName: string; // Internal name for 'Product Name'
  farmDetails: string; // Internal name for 'Supplier'
  quantity: string;
  timestamp: string;
  lat?: string;
  long?: string;
  collectorName?: string;
}

declare module 'html5-qrcode';