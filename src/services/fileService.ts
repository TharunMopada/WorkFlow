import { FileAnalysis } from '../types';

export const analyzeFile = async (file: File): Promise<FileAnalysis> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      // Simulate file analysis
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const analysis: FileAnalysis = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'success',
        extractedText: content.substring(0, 1000), // First 1000 characters
        wordCount: content.split(/\s+/).length,
        pageCount: Math.ceil(content.length / 2000), // Rough estimate
        metadata: {
          lastModified: new Date(file.lastModified),
          encoding: 'UTF-8'
        }
      };
      
      resolve(analysis);
    };
    
    reader.onerror = () => {
      resolve({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'error',
        error: 'Failed to read file'
      });
    };
    
    // Read as text for analysis
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For other file types, simulate analysis
      setTimeout(() => {
        resolve({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          status: 'success',
          extractedText: `Extracted content from ${file.name}. This is a simulated extraction for demonstration purposes.`,
          wordCount: Math.floor(Math.random() * 1000) + 100,
          pageCount: Math.floor(Math.random() * 50) + 1,
          metadata: {
            lastModified: new Date(file.lastModified),
            encoding: 'Binary'
          }
        });
      }, 1000);
    }
  });
};

export const uploadFile = async (file: File): Promise<string> => {
  // Simulate file upload to server
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        resolve(`/uploads/${file.name}`);
      } else {
        reject(new Error('Upload failed'));
      }
    }, 2000);
  });
};