import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimizeImages() {
  console.log('🖼️  Optimizing images...');

  // Optimize background image to multiple sizes
  const backgroundSizes = [
    { width: 640, suffix: 'sm' },
    { width: 1024, suffix: 'md' },
    { width: 1920, suffix: 'lg' },
  ];

  try {
    for (const size of backgroundSizes) {
      await sharp('Background')
        .resize(size.width, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(`public/assets/images/background-${size.suffix}.webp`);

      console.log(`✓ Created background-${size.suffix}.webp`);
    }

    // Create a highly optimized fallback PNG
    await sharp('Background')
      .resize(1920, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile('public/assets/images/background.png');

    console.log('✓ Created optimized background.png fallback');

    // Copy and optimize logo
    if (fs.existsSync('Logo.svg')) {
      fs.copyFileSync('Logo.svg', 'public/assets/images/logo.svg');
      console.log('✓ Copied logo.svg');
    }

    console.log('\n✅ Image optimization complete!');

    // Show size comparison
    const originalSize = fs.statSync('Background').size;
    const optimizedSize = fs.statSync('public/assets/images/background-lg.webp').size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

    console.log(`\n📊 Size comparison:`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   Optimized (large WebP): ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`   Savings: ${savings}%`);

  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
