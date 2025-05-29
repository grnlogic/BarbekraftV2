interface InstagramPost {
  caption: string;
  imageUrl: string;
  hashtags: string[];
}

class InstagramService {
  openInstagramApp() {
      throw new Error("Method not implemented.");
  }
  copyToClipboard(caption: string) {
      throw new Error("Method not implemented.");
  }
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Generate caption template
  generateCaption(suggestion: any, userImage?: string): string {
    const hashtags = [
      '#DIY', '#upcycling', '#kerajinan', '#ramahlingkungan', 
      '#crafting', '#handmade', '#recycle', '#sustainable',
      `#${suggestion.kategori.toLowerCase()}`,
      `#${suggestion.nama.toLowerCase().replace(/\s+/g, '')}`
    ];

    const caption = `🎨 ${suggestion.nama} 

✨ Mengubah barang bekas menjadi ${suggestion.nama} yang cantik dan bermanfaat!

📋 Bahan yang dibutuhkan:
${suggestion.bahan.slice(0, 5).map((item: string) => `• ${item}`).join('\n')}

⏰ Estimasi waktu: ${suggestion.estimasiWaktu}
🎯 Tingkat kesulitan: ${suggestion.tingkatKesulitan}

💡 Tips: ${suggestion.bahanInfo}

${hashtags.join(' ')}

#BarbekraftAI #KerajinanIndonesia`;

    return caption;
  }

  // Create Instagram post data
  createPostData(suggestion: any, userImage?: string, tutorialImages?: string[]): InstagramPost {
    return {
      caption: this.generateCaption(suggestion, userImage),
      imageUrl: userImage || '',
      hashtags: [
        'DIY', 'upcycling', 'kerajinan', 'ramahlingkungan', 
        'crafting', 'handmade', 'recycle', 'sustainable',
        suggestion.kategori.toLowerCase(),
        suggestion.nama.toLowerCase().replace(/\s+/g, '')
      ]
    };
  }

  // Share to Instagram (requires Instagram Basic Display API)
  async shareToInstagram(postData: InstagramPost, accessToken: string): Promise<any> {
    try {
      // Step 1: Upload image to Instagram
      const uploadResponse = await fetch(`https://graph.instagram.com/me/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: postData.imageUrl,
          caption: postData.caption,
          access_token: accessToken
        })
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.id) {
        throw new Error('Failed to upload image');
      }

      // Step 2: Publish the post
      const publishResponse = await fetch(`https://graph.instagram.com/me/media_publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: uploadData.id,
          access_token: accessToken
        })
      });

      return await publishResponse.json();
    } catch (error) {
      console.error('Instagram share error:', error);
      throw error;
    }
  }
}

export default new InstagramService();