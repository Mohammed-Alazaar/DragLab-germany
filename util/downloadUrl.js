function toDownloadUrl(filePath, fileName) {
  if (!filePath) return '#';
  const encoded = encodeURIComponent(fileName || 'download');
  if (filePath.includes('/upload/fl_attachment:')) return filePath; // already formatted
  return filePath.replace('/upload/', `/upload/fl_attachment:${encoded}/`);
}
  