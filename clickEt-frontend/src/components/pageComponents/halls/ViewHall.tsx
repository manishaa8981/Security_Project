import React from 'react';
import { Armchair } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';

interface Section {
  rows: number;
  columns: number;
  startRow: string;
  startNumber: number;
}

interface LayoutData {
  sections: Section[];
}

interface ViewLayoutProps {
  layout: LayoutData;
}

const ViewLayout: React.FC<ViewLayoutProps> = ({ layout }) => {
  const getGlobalRowRange = () => {
    const minRowChar = Math.min(
      ...layout.sections.map((s) => s.startRow.charCodeAt(0))
    );
    const maxRowChar = Math.max(
      ...layout.sections.map((s) => s.startRow.charCodeAt(0) + s.rows - 1)
    );
    return {
      startChar: String.fromCharCode(minRowChar),
      endChar: String.fromCharCode(maxRowChar),
    };
  };

  const renderRowAcrossSections = (rowChar: string) => {
    return layout.sections.map((section, index) => {
      const rowIndex = rowChar.charCodeAt(0) - section.startRow.charCodeAt(0);
      if (rowIndex < 0 || rowIndex >= section.rows) {
        return null;
      }

      const seats = [];
      for (let c = 0; c < section.columns; c++) {
        const seatNumber = section.startNumber + c;
        const seatId = `${rowChar}${seatNumber}`;

        seats.push(
          <div key={seatId} className="flex flex-col items-center gap-1">
            <Armchair className="w-6 h-6 text-gray-400" />
            <span className="text-xs font-medium">{seatId}</span>
          </div>
        );
      }

      return (
        <div key={`sect-${index}`} className="flex items-center">
          {index > 0 && <div className="mx-5" />}
          {seats}
        </div>
      );
    });
  };

  const renderAllRows = () => {
    const { startChar, endChar } = getGlobalRowRange();
    const rows = [];

    for (
      let rowCode = startChar.charCodeAt(0);
      rowCode <= endChar.charCodeAt(0);
      rowCode++
    ) {
      const rowChar = String.fromCharCode(rowCode);
      const rowSegments = renderRowAcrossSections(rowChar);

      if (rowSegments.every((seg) => seg === null)) {
        continue;
      }

      rows.push(
        <div key={`row-${rowChar}`} className="flex items-center gap-8">
          <div className="w-8 flex items-center justify-center font-medium">
            {rowChar}
          </div>
          <div className="flex">{rowSegments}</div>
        </div>
      );
    }

    return rows;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hall Layout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex flex-col items-center gap-8">
          <div className="w-full max-w-3xl h-8 bg-primary rounded-sm flex items-center justify-center text-white">
            Screen
          </div>
          <div className="flex flex-col gap-2.5 items-center p-4 rounded-sm">
            {renderAllRows()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewLayout;