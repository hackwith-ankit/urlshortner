import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Download, QrCode } from 'lucide-react';

interface QrCodePreviewProps {
  qrCodeData: string;
  shortCode: string;
}

export const QrCodePreview: React.FC<QrCodePreviewProps> = ({ qrCodeData, shortCode }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qr-code-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="flex items-center space-x-2 border-b border-border w-full pb-4 justify-center">
        <QrCode className="h-5 w-5 text-primary" />
        <span className="font-semibold text-lg text-foreground">QR Code Preview</span>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <img 
          src={qrCodeData} 
          alt={`QR Code for ${shortCode}`} 
          className="h-44 w-44 object-contain"
        />
      </div>
      <Button variant="outline" className="w-full flex items-center justify-center space-x-2" onClick={handleDownload}>
        <Download className="h-4 w-4" />
        <span>Download PNG</span>
      </Button>
    </Card>
  );
};
