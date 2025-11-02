import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private translate: TranslateService) { }

  async generatePdf(analysisResult: any) {
    try {
      // Create a simple HTML structure for the report
      const reportHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: white;">
          <h1 style="text-align: center; color: #333;">Crop Analysis Report</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <hr style="border: 1px solid #ccc; margin: 20px 0;">
          <h2>Disease Information</h2>
          <p><strong>Crop Type:</strong> ${analysisResult.cropType}</p>
          <p><strong>Disease Name:</strong> ${analysisResult.disease.name}</p>
          <p><strong>Cause:</strong> ${analysisResult.disease.cause}</p>
          <h3>Treatment</h3>
          <p>${analysisResult.disease.treatment}</p>
        </div>
      `;

      // Create a temporary element to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = reportHtml;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Capture as canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary element
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download the PDF
      pdf.save(`report-${analysisResult.cropType}-${Date.now()}.pdf`);
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  async generatePdfFromPage(elementId: string, filename: string = 'report.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Page content not found for PDF generation.');
      return;
    }

    try {
      // Wait for any pending DOM updates
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(filename);
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }
}
