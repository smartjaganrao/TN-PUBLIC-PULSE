import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, BookOpen, Zap, Shield, ExternalLink, ArrowLeft, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  category: 'Books' | 'Gear' | 'Tech';
  link: string;
  image: string;
  rating: number;
}

const products: AffiliateProduct[] = [
  {
    id: '7',
    title: 'Politics of Annihilation: Nationalism, Communism and the Communist Manifesto',
    description: 'This set of books explores a wide range of topics related to politics, including caste, atheism, nationalism and communism.',
    price: '₹320',
    category: 'Books',
    link: 'https://www.amazon.in/Politics-Annihilation-Nationalism-Communist-Manifesto/dp/9363790606?_encoding=UTF8&pd_rd_w=4I7IB&content-id=amzn1.sym.fa294cf3-99e4-435e-8284-16ec3b3e2443%3Aamzn1.symc.752cde0b-d2ce-4cce-9121-769ea438869e&pf_rd_p=fa294cf3-99e4-435e-8284-16ec3b3e2443&pf_rd_r=EQ4HH8JSBV3CHJ4MR86N&pd_rd_wg=Gn6EX&pd_rd_r=6595f552-cd66-4dfa-8b86-cb6a8919f0dd&linkCode=ll2&tag=tnpublicpulse-21&linkId=58c30be9860a23a529b06962447ca0de&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/81jmHEgy+KL._SY342_.jpg',
    rating: 4.4
  },
  {
    id: '8',
    title: 'The Argumentative Indian: Writings on Indian History, Culture and Identity',
    description: 'From Nobel prize-winning economist Amartya Sen, this book brings together writings on contemporary India, its culture, history and identity.',
    price: '₹382',
    category: 'Books',
    link: 'https://www.amazon.in/Argumentative-Indian-Writings-History-Identity/dp/0141012110?_encoding=UTF8&pd_rd_w=4I7IB&content-id=amzn1.sym.fa294cf3-99e4-435e-8284-16ec3b3e2443%3Aamzn1.symc.752cde0b-d2ce-4cce-9121-769ea438869e&pf_rd_p=fa294cf3-99e4-435e-8284-16ec3b3e2443&pf_rd_r=EQ4HH8JSBV3CHJ4MR86N&pd_rd_wg=Gn6EX&pd_rd_r=6595f552-cd66-4dfa-8b86-cb6a8919f0dd&linkCode=ll2&tag=tnpublicpulse-21&linkId=4ffadbc5332eca815e6d29b24a1f60d8&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/81jz1oGFymL._SY342_.jpg',
    rating: 4.4
  },
  {
    id: '9',
    title: 'Who Were The Untouchables? And How They Became Untouchables? I Tamil Book (தீண்டத்தகாதவர்கள் யார், அவர்கள் எப்படி தீண்டத்தகாதவர்களாக ஆனார்கள்?) Dr. Bhimrao Ambedkar Book |Tamil Books',
    description: 'This book exposes the roots of the caste system and untouchability. BR Ambedkar, who himself belonged to the untouchable caste, describes the lives of the untouchables and the discrimination and oppression they faced. The book analyses religious texts such as the Vedas, Puranas and Manusmriti to show how these texts declared the untouchables \'impure\' and \'inferior\' and isolated them from society.',
    price: '₹149',
    category: 'Books',
    link: 'https://www.amazon.in/Untouchables-%E0%AE%A4%E0%AF%80%E0%AE%A3%E0%AF%8D%E0%AE%9F%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%95%E0%AE%BE%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%95%E0%AE%BE%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%B5%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D-%E0%AE%8E%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%9F%E0%AE%BF-%E0%AE%A4%E0%AF%80%E0%AE%A3%E0%AF%8D%E0%AE%9F%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%95%E0%AE%BE%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%B5%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D-%E0%AE%86%E0%AE%A9%E0%AE%BE%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D/dp/9348572849?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-1&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/61BsMMiEEpL._SY342_.jpg',
    rating: 4.8
  },
  {
    id: '10',
    title: 'History Of Shudras : Who Were Shudras? About Shudras In Tamil (சூத்திரர்களின் வரலாறு (சூத்திரர்கள் யார்?)) Dr. Bhimrao Ambedkar Book |Tamil Book',
    description: 'This book presents a comprehensive social perspective of Shudras\' role in history and Indian society. It helps readers understand social inequality and the caste system in Indian society and makes them aware of the struggle of Shudras for their rights and social justice.',
    price: '₹180',
    category: 'Books',
    link: 'https://www.amazon.in/History-Shudras-%E0%AE%9A%E0%AF%82%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AE%BF%E0%AE%A9%E0%AF%8D-%E0%AE%9A%E0%AF%82%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D-Ambedkar/dp/9348572156?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-4&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/61fk2Ayrd6L._SY342_.jpg',
    rating: 3.8
  },
  {
    id: '11',
    title: 'Jaat-Paat Ka Vinash In Tamil (சாதியை அழித்தல்) Tamil Translation Of Annihilation Of Caste - Dr. Bhimrao Ambedkar Book | Tamil Book',
    description: 'Ambedkar considers the caste system a crime against humanity in the book. He argues that this system is based on inequality, injustice and oppression, leading to social division and conflict. He traces the roots of the caste system to ancient Hindu texts and criticizes the caste classification and discrimination mentioned in texts such as the Vedas, Upanishads and Manusmriti.',
    price: '₹143',
    category: 'Books',
    link: 'https://www.amazon.in/Jaat-Paat-Vinash-%E0%AE%85%E0%AE%B4%E0%AE%BF%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%B2%E0%AF%8D-Translation-Annihilation/dp/9348572695?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-2&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/71Xq1OAbvuL._SY342_.jpg',
    rating: 4.3
  },
  {
    id: '12',
    title: 'Meri Aatmakatha : Meri Kahani, Meri Jubaani In Tamil (இது எனது சுயசரிதை : என் கதை, என் குரல்) Dr. B.R. Ambedkar: Autobiography Of A Fighter For Social Reform, Human Rights, And Empowerment',
    description: 'The legacy of Dr. Ambedkar transcends the boundaries of his era and resonates profoundly with the contemporary world. His life was a testament to the power of education, the importance of social reform, and the relentless pursuit of equality. Born into an environment rife with social injustice and discrimination, Dr. Ambedkar\'s rise to prominence is a story of defying odds and challenging the status quo.',
    price: '₹162',
    category: 'Books',
    link: 'https://www.amazon.in/Meri-Aatmakatha-%E0%AE%9A%E0%AF%81%E0%AE%AF%E0%AE%9A%E0%AE%B0%E0%AE%BF%E0%AE%A4%E0%AF%88-Autobiography-Empowerment/dp/9363181707?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-3&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/61bhq9l7XkL._SY342_.jpg',
    rating: 4.9
  },
  {
    id: '13',
    title: 'INDIYAAVIL SAATHIKAL (இந்தியாவில் சாதிகள்)',
    description: 'A Tamil translation of Dr. B.R. Ambedkar\'s work on the caste system in India. The book explains how the caste system is deeply ingrained in Hindu society and provides ways to eradicate it. Dr. Ambedkar argues that without changing the social structure, no real progress can be made.',
    price: '₹169',
    category: 'Books',
    link: 'https://www.amazon.in/INDIYAAVIL-SAATHIKAL-DR-AMBEDKAR/dp/9384646563?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-5&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/51GykpNnMxL._SY342_.jpg',
    rating: 4.5
  },
  {
    id: '14',
    title: 'Ambedkar',
    description: 'A Tamil biography of Dr. B.R. Ambedkar written by R. Muthukumar. The book explores Ambedkar\'s political struggles, his challenges to the caste system, rejection of Manusmriti, and his role in drafting the Indian Constitution. It presents him as a revolutionary figure who fought for social justice and equality.',
    price: '₹200',
    category: 'Books',
    link: 'https://www.amazon.in/Ambedkar-R-Muthukumar/dp/8184933460?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-6&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/61ySZoZPMAL._SY342_.jpg',
    rating: 4.5
  },
  {
    id: '15',
    title: 'Sila Nerangalil Sila Manidhargal',
    description: 'A Tamil novel by Jayakanthan, a renowned Tamil writer and Sahitya Akademi award winner. The novel explores themes of human relationships, social issues, and personal struggles in a changing society. It\'s considered one of his masterpieces and won the Sahitya Akademi Award.',
    price: '₹400',
    category: 'Books',
    link: 'https://www.amazon.in/Sila-Nerangalil-Manidhargal-Jayakanthan/dp/B00JXG2GS6?crid=3G7KT527BVFCF&dib=eyJ2IjoiMSJ9.ShihdIZy_mXbYvZCYbcHwiwSXutBQRP3FaJqUGYmztrbP31AJkRlj1TEpuBTNEM7jEnQpkPNVNnB8ltyrZ19rfMp2cS-IcREszI_yfe-ZPXzgMG8WbEQ2sE2438kjW8ybJuQPID5EDsM6OKPTxWP-nna2Ko-yE-a-yrfy0XZCYcnv2UCsAr4Lac8EJ5qjh7cE6H3sDFqoGu7_fd5nSH8xUZ_rGwwQWMx7EoIO9o5ZVw.0EEPNqtfBcqax42bgIz4WLSIj62H9pA-j55IgIOUJNs&dib_tag=se&keywords=tamil+politics+books&qid=1773504293&s=books&sprefix=tamil+politics+books%2Cstripbooks%2C390&sr=1-7&linkCode=ll2&tag=tnpublicpulse-21&linkId=bc1f83a0e7a02f42a47ddbec4739e0ed&ref_=as_li_ss_tl',
    image: 'https://m.media-amazon.com/images/I/81AYANjOq3L._SY342_.jpg',
    rating: 4.4
  }
];

const AffiliatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Helmet>
        <title>Supporter Shop | Tamil Pulse 2026 Political Gear & Books</title>
        <meta name="description" content="Browse our curated selection of political history books, supporter gear, and essentials for the 2026 Tamil Nadu elections." />
        <meta property="og:title" content="Supporter Shop | Tamil Pulse 2026 Political Gear & Books" />
        <meta property="og:description" content="Browse our curated selection of political history books, supporter gear, and essentials for the 2026 Tamil Nadu elections." />
        <meta property="og:url" content={`${window.location.origin}/shop`} />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-zinc-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-4">
              <ArrowLeft size={12} />
              Back to Home
            </Link>
            <h1 className="text-5xl sm:text-8xl font-black font-display tracking-tighter leading-none">
              SUPPORTER <span className="text-emerald-400">SHOP.</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl font-medium text-sm sm:text-xl leading-relaxed">
              Essential resources, gear, and reading materials for the informed citizen. Support the community while staying prepared for the 2026 journey.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col h-full"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 p-6 flex-shrink-0">
                <div className="w-full h-full bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-900 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900/80 backdrop-blur-md rounded-lg text-[10px] font-black text-amber-400">
                      <Star size={10} fill="currentColor" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 flex-shrink-0">
                  <h3 className="text-xl font-black font-display text-zinc-900 leading-tight line-clamp-2 flex-1 min-w-0">
                    {product.title}
                  </h3>
                  <span className="text-lg font-black text-emerald-600 shrink-0">
                    {product.price}
                  </span>
                </div>
                
                <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3 flex-1">
                  {product.description}
                </p>

                <div className="pt-4 flex items-center gap-3 flex-shrink-0">
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    View on Amazon <ExternalLink size={14} />
                  </a>
                  <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Affiliate Disclaimer */}
      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        <div className="p-8 bg-zinc-100 rounded-[2rem] border border-zinc-200">
          <div className="flex justify-center mb-4">
            <Shield className="text-zinc-400" size={32} />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-2">Affiliate Disclosure</h4>
          <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
            As an Amazon Associate, we earn from qualifying purchases. This means we may receive a small commission at no extra cost to you if you purchase through these links. These commissions help support the maintenance and hosting of the TN Pulse community platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;
