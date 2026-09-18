'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Music,
  Sparkles,
  BookOpen,
  Crown,
  Compass,
  Palette,
  Utensils,
  ChevronRight,
  Search,
  Play,
  X,
  Award,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

// ============================================================
// REAL CULTURE ITEM INTERFACE
// ============================================================
interface CultureItem {
  id: string;
  category: 'language' | 'dance' | 'music' | 'heritage' | 'festivals' | 'craft' | 'cuisine';
  title: string;
  titleRaj: string;
  subTitle: string;
  subTitleRaj: string;
  region: string;
  regionRaj: string;
  description: string;
  descriptionRaj: string;
  longDescription: string;
  longDescriptionRaj: string;
  imageUrl: string;
  tag: string;
  tagRaj: string;
  keyHighlights: string[];
  keyHighlightsRaj: string[];
  mayadConnection: string;
  mayadConnectionRaj: string;
}

// ============================================================
// REAL RAJASTHAN & MAYAD CULTURE DATA
// ============================================================
const REAL_CULTURE_ITEMS: CultureItem[] = [
  {
    id: 'rajasthani-language-literature',
    category: 'language',
    title: 'Rajasthani Language & Literature',
    titleRaj: 'राजस्थानी भाषा एवं साहित्य',
    subTitle: 'Languages, Dialects & Literary Heritage',
    subTitleRaj: 'बोलियां, साहित्य और मायड़ भाषा री विरासत',
    region: 'Across Rajasthan',
    regionRaj: 'समूचा राजस्थान',
    description: 'Rajasthani is a major language tradition of Rajasthan with regional varieties including Marwari, Mewari, Dhundari, Mewati, Hadoti and Vagadi.',
    descriptionRaj: 'राजस्थानी भाषा राजस्थान री समृद्ध भाषाई परंपरा है, जिणमें मारवाड़ी, मेवाड़ी, ढूँढाड़ी, मेवाती, हाड़ौती और वागड़ी जैसी क्षेत्रीय बोलियां शामिल हैं।',
    longDescription: 'Rajasthani has a long literary and cultural history. Government of Rajasthan sources describe Marwari, Mewari, Dundari, Vagadi and other regional varieties as part of the state’s linguistic heritage. Rajasthan also has a dedicated Rajasthani Bhasha Sahitya & Sanskriti Academy working for the promotion of Rajasthani literature and culture.',
    longDescriptionRaj: 'राजस्थानी भाषा री साहित्यिक और सांस्कृतिक परंपरा बहुत समृद्ध है। राजस्थान सरकार राजस्थानी भाषा में मारवाड़ी, मेवाड़ी, ढूँढाड़ी, वागड़ी आदि क्षेत्रीय बोलियों का उल्लेख करती है। राजस्थानी भाषा साहित्य एवं संस्कृति अकादमी भाषा और साहित्य के संरक्षण एवं प्रचार-प्रसार के लिए कार्य करती है।',
    imageUrl: '/culture/mayad_bhasha.jpg',
    tag: 'Language & Literature',
    tagRaj: 'भाषा एवं साहित्य',
    keyHighlights: [
      'Regional varieties include Marwari, Mewari, Dhundari, Mewati, Hadoti and Vagadi',
      'Strong oral and literary traditions across Rajasthan',
      'Rajasthani Bhasha Sahitya & Sanskriti Academy promotes the language and literature',
      'Language traditions remain closely connected with local history and culture',
    ],
    keyHighlightsRaj: [
      'मारवाड़ी, मेवाड़ी, ढूँढाड़ी, मेवाती, हाड़ौती और वागड़ी जैसी बोलियां',
      'राजस्थान में समृद्ध मौखिक और साहित्यिक परंपरा',
      'राजस्थानी भाषा साहित्य एवं संस्कृति अकादमी द्वारा भाषा-साहित्य का प्रचार',
      'भाषा का स्थानीय इतिहास और संस्कृति से गहरा संबंध',
    ],
    mayadConnection: 'MAYAD can use cinema, music and storytelling to bring regional Rajasthani voices to digital audiences.',
    mayadConnectionRaj: 'मायड़ सिनेमा, संगीत और कहानियों के माध्यम से राजस्थानी भाषाई विरासत को डिजिटल दर्शकों तक पहुंचा सकता है।',
  },
  {
    id: 'ghoomar-dance',
    category: 'dance',
    title: 'Ghoomar Folk Dance',
    titleRaj: 'घूमर लोक नृत्य',
    subTitle: 'A Signature Folk Dance of Rajasthan',
    subTitleRaj: 'राजस्थान रो प्रसिद्ध लोक नृत्य',
    region: 'Rajasthan',
    regionRaj: 'राजस्थान',
    description: 'Ghoomar is a traditional Rajasthani folk dance recognised for circular movements, graceful turns and traditional dress.',
    descriptionRaj: 'घूमर राजस्थान रो प्रसिद्ध लोक नृत्य है, जिणमें गोल घूमती चाल, लयबद्ध गति और पारंपरिक पोशाक मुख्य पहचान हैं।',
    longDescription: 'Ghoomar is one of Rajasthan’s best-known folk dances. Performers move in circular patterns with rhythmic footwork and coordinated hand movements while traditional Rajasthani dress creates the characteristic visual effect of the dance. It is performed in cultural celebrations and community occasions across Rajasthan.',
    longDescriptionRaj: 'घूमर राजस्थान रा प्रसिद्ध लोक नृत्यां में एक है। नर्तक गोल घेरे में लयबद्ध कदम और हाथां री गति के साथ नृत्य करते हैं। पारंपरिक राजस्थानी पोशाक, घाघरा और ओढ़नी घूमर ने खास दृश्य पहचान देवें है। यह नृत्य सांस्कृतिक समारोह और सामुदायिक उत्सवां में प्रस्तुत किया जाता है।',
    imageUrl: '/culture/ghoomar_dance.jpg',
    tag: 'Folk Dance',
    tagRaj: 'लोक नृत्य',
    keyHighlights: [
      'Circular formations and graceful rhythmic movements',
      'Traditional Rajasthani dress is an important visual element',
      'Performed during cultural celebrations and community occasions',
      'A widely recognised symbol of Rajasthan’s folk culture',
    ],
    keyHighlightsRaj: [
      'गोल घेरे में लयबद्ध और सुंदर नृत्य गति',
      'पारंपरिक राजस्थानी पोशाक इसकी खास पहचान',
      'सांस्कृतिक समारोह और उत्सवां में प्रस्तुति',
      'राजस्थान री लोक संस्कृति रो प्रसिद्ध प्रतीक',
    ],
    mayadConnection: 'MAYAD can showcase Rajasthani dance through films, music videos and cultural stories.',
    mayadConnectionRaj: 'मायड़ फ़िल्म, म्यूज़िक वीडियो और सांस्कृतिक कहानियों के माध्यम से घूमर जैसी लोक कलाओं को प्रस्तुत कर सकता है।',
  },
  {
    id: 'kalbelia-dance',
    category: 'dance',
    title: 'Kalbelia Folk Songs & Dance',
    titleRaj: 'कालबेलिया लोक गीत एवं नृत्य',
    subTitle: 'UNESCO Intangible Cultural Heritage',
    subTitleRaj: 'यूनेस्को मानवता री अमूर्त सांस्कृतिक धरोहर',
    region: 'Rajasthan',
    regionRaj: 'राजस्थान',
    description: 'Kalbelia songs and dances express the traditional life of the Kalbelia community and are known for flowing movements, black costumes and poongi and khanjari accompaniment.',
    descriptionRaj: 'कालबेलिया गीत और नृत्य कालबेलिया समुदाय री पारंपरिक जीवन शैली सूं जुड़े हैं। काली पोशाक, लचकदार नृत्य और पूंगी-खंजरी री धुन इसकी खास पहचान है।',
    longDescription: 'UNESCO inscribed Kalbelia folk songs and dances of Rajasthan on the Representative List of the Intangible Cultural Heritage of Humanity in 2010. UNESCO describes the tradition as an expression of the Kalbelia community’s way of life. Women dance in flowing black skirts and imitate serpent-like movements, while men accompany performances with instruments including the khanjari and poongi.',
    longDescriptionRaj: 'यूनेस्को ने वर्ष 2010 में राजस्थान के कालबेलिया लोक गीत एवं नृत्य को मानवता की अमूर्त सांस्कृतिक धरोहर की प्रतिनिधि सूची में शामिल किया। यूनेस्को के अनुसार यह परंपरा कालबेलिया समुदाय की जीवन शैली और पहचान से जुड़ी है। नृत्य में महिलाएं काली लहराती पोशाक पहनकर सर्प जैसी गति प्रस्तुत करती हैं और पुरुष खंजरी व पूंगी जैसे वाद्य बजाते हैं।',
    imageUrl: '/culture/kalbelia_dance.jpg',
    tag: 'UNESCO Heritage',
    tagRaj: 'यूनेस्को धरोहर',
    keyHighlights: [
      'Inscribed by UNESCO in 2010',
      'Traditional expression of the Kalbelia community',
      'Flowing black costumes and serpent-like dance movements',
      'Poongi and khanjari are associated with the musical tradition',
    ],
    keyHighlightsRaj: [
      'वर्ष 2010 में यूनेस्को की प्रतिनिधि सूची में शामिल',
      'कालबेलिया समुदाय की पारंपरिक सांस्कृतिक अभिव्यक्ति',
      'काली पोशाक और सर्प जैसी लयबद्ध नृत्य गति',
      'पूंगी और खंजरी लोक संगीत परंपरा से जुड़े वाद्य',
    ],
    mayadConnection: 'MAYAD can document and showcase Rajasthan’s living folk traditions through authentic films and music.',
    mayadConnectionRaj: 'मायड़ प्रामाणिक फ़िल्मों और संगीत के माध्यम से राजस्थान री जीवंत लोक परंपराओं को दस्तावेज़ित और प्रस्तुत कर सकता है।',
  },
  {
    id: 'manganiyar-folk-music',
    category: 'music',
    title: 'Manganiyar Folk Music',
    titleRaj: 'मांगणियार लोक संगीत',
    subTitle: 'Folk Music of the Thar Desert',
    subTitleRaj: 'थार मरुस्थल री सुरीली लोक परंपरा',
    region: 'Barmer & Jaisalmer',
    regionRaj: 'बाड़मेर एवं जैसलमेर',
    description: 'Manganiyar musicians are renowned folk musicians of the Thar Desert who have preserved songs and musical traditions through generations.',
    descriptionRaj: 'मांगणियार थार मरुस्थल रा प्रसिद्ध लोक कलाकार हैं, जिण्होंने पीढ़ियों सूं गीत और संगीत री परंपराओं ने जीवित राखी है।',
    longDescription: 'Rajasthan Tourism describes the Manganiyars as world-famous folk musicians of the Thar Desert, especially associated with the Barmer and Jaisalmer region. Their repertoire preserves songs about local rulers, historical events, devotion and desert life, passing musical knowledge from one generation to the next.',
    longDescriptionRaj: 'राजस्थान पर्यटन मांगणियारों ने थार मरुस्थल रा प्रसिद्ध लोक संगीतकार बतावै है, खासकर बाड़मेर और जैसलमेर क्षेत्र सूं इनरी गहरी पहचान है। इनरै गीत स्थानीय शासकों, ऐतिहासिक घटनाओं, भक्ति और मरुस्थलीय जीवन की कथाओं ने पीढ़ी दर पीढ़ी आगे बढ़ावै है।',
    imageUrl: '/culture/rajasthani_music.jpg',
    tag: 'Desert Folk Music',
    tagRaj: 'मरु लोक संगीत',
    keyHighlights: [
      'Strong association with the Thar Desert',
      'Barmer and Jaisalmer are important centres of the tradition',
      'Songs preserve stories of local history, rulers and devotion',
      'Musical knowledge is transmitted across generations',
    ],
    keyHighlightsRaj: [
      'थार मरुस्थल सूं गहरा सांस्कृतिक संबंध',
      'बाड़मेर और जैसलमेर प्रमुख क्षेत्र',
      'गीतां में इतिहास, लोक कथाएं और भक्ति रो वर्णन',
      'संगीत री परंपरा पीढ़ी दर पीढ़ी आगे बढ़ती है',
    ],
    mayadConnection: 'MAYAD can preserve regional music through recordings, documentaries and original cultural programming.',
    mayadConnectionRaj: 'मायड़ रिकॉर्डिंग, डॉक्यूमेंट्री और ओरिजिनल सांस्कृतिक कार्यक्रमों के माध्यम से लोक संगीत ने संरक्षित कर सकता है।',
  },
  {
    id: 'forts-architecture',
    category: 'heritage',
    title: 'Hill Forts of Rajasthan',
    titleRaj: 'राजस्थान के पर्वतीय दुर्ग',
    subTitle: 'UNESCO World Heritage Forts',
    subTitleRaj: 'यूनेस्को विश्व धरोहर दुर्ग',
    region: 'Chittorgarh, Kumbhalgarh, Sawai Madhopur, Jhalawar, Jaipur & Jaisalmer',
    regionRaj: 'चित्तौड़गढ़, कुंभलगढ़, सवाई माधोपुर, झालावाड़, जयपुर एवं जैसलमेर',
    description: 'The UNESCO-listed Hill Forts of Rajasthan are a serial World Heritage property representing the fortified seats of Rajput princely states.',
    descriptionRaj: 'राजस्थान के यूनेस्को सूचीबद्ध पर्वतीय दुर्ग राजपूत रियासतों की मजबूत किलेबंदी, स्थापत्य और सांस्कृतिक विरासत को दर्शाते हैं।',
    longDescription: 'UNESCO inscribed the Hill Forts of Rajasthan as a World Heritage property in 2013. The serial property includes six forts: Chittorgarh, Kumbhalgarh, Ranthambore, Gagron, Amber and Jaisalmer. UNESCO highlights their defensive architecture, palaces, temples, urban settlements, trade centres and water-harvesting structures.',
    longDescriptionRaj: 'यूनेस्को ने वर्ष 2013 में राजस्थान के Hill Forts of Rajasthan को विश्व धरोहर सूची में शामिल किया। इस श्रृंखला में चित्तौड़गढ़, कुंभलगढ़, रणथंभौर, गागरोन, आमेर और जैसलमेर के छह दुर्ग शामिल हैं। इन दुर्गों में किलेबंदी, महल, मंदिर, बस्तियां, व्यापारिक केंद्र और जल-संरक्षण संरचनाएं राजस्थान के इतिहास और स्थापत्य की समृद्ध परंपरा दिखाती हैं।',
    imageUrl: '/culture/chittorgarh_fort.jpg',
    tag: 'UNESCO World Heritage',
    tagRaj: 'यूनेस्को विश्व धरोहर',
    keyHighlights: [
      'Six forts form the UNESCO Hill Forts of Rajasthan serial property',
      'Inscribed on the World Heritage List in 2013',
      'Includes Chittorgarh, Kumbhalgarh, Ranthambore, Gagron, Amber and Jaisalmer',
      'Combines fortifications, palaces, temples, settlements and water systems',
    ],
    keyHighlightsRaj: [
      'छह दुर्ग मिलकर यूनेस्को की Hill Forts of Rajasthan श्रृंखला बनाते हैं',
      'वर्ष 2013 में विश्व धरोहर सूची में शामिल',
      'चित्तौड़गढ़, कुंभलगढ़, रणथंभौर, गागरोन, आमेर और जैसलमेर शामिल',
      'किलेबंदी, महल, मंदिर, बस्तियां और जल-संरचना का संगम',
    ],
    mayadConnection: 'MAYAD can tell historical and cultural stories connected with Rajasthan’s forts and heritage sites.',
    mayadConnectionRaj: 'मायड़ राजस्थान रा दुर्गों और धरोहर स्थलों से जुड़ी ऐतिहासिक और सांस्कृतिक कहानियां प्रस्तुत कर सकता है।',
  },
  {
    id: 'pushkar-fair',
    category: 'festivals',
    title: 'Pushkar Fair',
    titleRaj: 'पुष्कर मेला',
    subTitle: 'Camel, Livestock, Faith & Folk Culture',
    subTitleRaj: 'ऊंट, पशुधन, आस्था और लोक संस्कृति रो मेला',
    region: 'Pushkar, Ajmer',
    regionRaj: 'पुष्कर, अजमेर',
    description: 'Pushkar Fair is an annual camel and livestock fair held in Pushkar around October and November, closely connected with Kartik Purnima.',
    descriptionRaj: 'पुष्कर मेला अक्टूबर-नवंबर में पुष्कर में लगने वाला प्रसिद्ध ऊंट और पशुधन मेला है, जिणरो संबंध कार्तिक पूर्णिमा सूं है।',
    longDescription: 'Rajasthan Tourism describes Pushkar Fair as an annual camel and livestock fair held in Pushkar between October and November. Along with livestock trading, the fair features cultural programmes and competitions such as matka phod, longest moustache and bridal competitions. The fair is also closely associated with the religious significance of Pushkar Lake and Kartik Purnima.',
    longDescriptionRaj: 'राजस्थान पर्यटन के अनुसार पुष्कर मेला अक्टूबर और नवंबर के बीच पुष्कर में आयोजित होने वाला वार्षिक ऊंट और पशुधन मेला है। पशुधन व्यापार के साथ यहां सांस्कृतिक कार्यक्रम और मटका फोड़, लंबी मूंछ तथा दुल्हन प्रतियोगिता जैसी गतिविधियां होती हैं। पुष्कर झील और कार्तिक पूर्णिमा के धार्मिक महत्व के कारण भी इस मेले की विशेष पहचान है।',
    imageUrl: '/culture/pushkar_fair.jpg',
    tag: 'Fairs & Festivals',
    tagRaj: 'मेले एवं उत्सव',
    keyHighlights: [
      'Annual camel and livestock fair in Pushkar',
      'Held around October–November and linked with Kartik Purnima',
      'Cultural programmes and traditional competitions',
      'Pushkar Lake adds an important religious dimension',
    ],
    keyHighlightsRaj: [
      'पुष्कर में लगने वाला वार्षिक ऊंट और पशुधन मेला',
      'अक्टूबर-नवंबर और कार्तिक पूर्णिमा से जुड़ी परंपरा',
      'लोक सांस्कृतिक कार्यक्रम और पारंपरिक प्रतियोगिताएं',
      'पुष्कर झील का महत्वपूर्ण धार्मिक संबंध',
    ],
    mayadConnection: 'MAYAD can cover Rajasthan’s fairs and festivals through documentary stories, music and cultural features.',
    mayadConnectionRaj: 'मायड़ डॉक्यूमेंट्री, संगीत और सांस्कृतिक फीचर के माध्यम से राजस्थान रा मेलां और उत्सवां को कवर कर सकता है।',
  },
  {
    id: 'rajasthani-handicrafts',
    category: 'craft',
    title: 'Rajasthani Handicrafts & Textiles',
    titleRaj: 'राजस्थानी हस्तशिल्प एवं वस्त्र कला',
    subTitle: 'Bandhani, Block Printing, Blue Pottery & Kathputli',
    subTitleRaj: 'बंधेज, ब्लॉक प्रिंट, ब्लू पॉटरी और कठपुतली',
    region: 'Jaipur, Jodhpur, Sanganer, Bagru & across Rajasthan',
    regionRaj: 'जयपुर, जोधपुर, सांगानेर, बगरू एवं समूचा राजस्थान',
    description: 'Rajasthan is known for diverse crafts including Bandhani textiles, Sanganer and Bagru block printing, Jaipur Blue Pottery, miniature painting and Kathputli.',
    descriptionRaj: 'राजस्थान बंधेज, सांगानेर-बगरू ब्लॉक प्रिंट, जयपुर ब्लू पॉटरी, लघु चित्रकला और कठपुतली जैसी विविध कला परंपराओं के लिए प्रसिद्ध है।',
    longDescription: 'Rajasthan Tourism highlights the state’s textile and craft traditions, including Bandhani tie-and-dye from Jaipur, Jodhpur and Bikaner, block printing from Sanganer and Bagru, and Blue Pottery associated with Jaipur. Rajasthan is also known for miniature painting, stone carving, leatherwork, carpets and the traditional Kathputli puppet art.',
    longDescriptionRaj: 'राजस्थान पर्यटन राज्य की विविध हस्तशिल्प परंपराओं में जयपुर, जोधपुर और बीकानेर की बंधेज, सांगानेर और बगरू की ब्लॉक प्रिंटिंग तथा जयपुर की ब्लू पॉटरी को प्रमुखता देता है। राजस्थान लघु चित्रकला, पत्थर की नक्काशी, चमड़े का काम, कालीन-दरी और पारंपरिक कठपुतली कला के लिए भी जाना जाता है।',
    imageUrl: '/culture/bandhani_craft.jpg',
    tag: 'Arts & Crafts',
    tagRaj: 'हस्तशिल्प एवं कला',
    keyHighlights: [
      'Bandhani tie-and-dye traditions in Jaipur, Jodhpur and Bikaner',
      'Sanganer and Bagru are known for block printing',
      'Jaipur is strongly associated with Blue Pottery',
      'Kathputli, miniature painting, stonework and leather crafts add to Rajasthan’s craft heritage',
    ],
    keyHighlightsRaj: [
      'जयपुर, जोधपुर और बीकानेर की बंधेज परंपरा',
      'सांगानेर और बगरू की प्रसिद्ध ब्लॉक प्रिंटिंग',
      'जयपुर की खास पहचान ब्लू पॉटरी',
      'कठपुतली, लघु चित्रकला, पत्थर और चमड़ा शिल्प की समृद्ध परंपरा',
    ],
    mayadConnection: 'MAYAD can highlight artisans, crafts and regional stories through cultural documentaries and original features.',
    mayadConnectionRaj: 'मायड़ डॉक्यूमेंट्री और ओरिजिनल फीचर के माध्यम से कारीगरों, हस्तशिल्प और क्षेत्रीय कहानियों को सामने ला सकता है।',
  },
  {
    id: 'rajasthani-cuisine',
    category: 'cuisine',
    title: 'Rajasthani Cuisine',
    titleRaj: 'राजस्थानी खान-पान',
    subTitle: 'Traditional Flavours of Rajasthan',
    subTitleRaj: 'राजस्थान री पारंपरिक स्वाद परंपरा',
    region: 'Across Rajasthan',
    regionRaj: 'समूचा राजस्थान',
    description: 'Rajasthani cuisine includes iconic dishes such as Dal Baati Churma, Ker Sangri, Gatte ki Sabzi, Bajra Roti and regional sweets.',
    descriptionRaj: 'राजस्थानी खान-पान में दाल-बाटी-चूरमा, केर-सांगरी, गट्टे की सब्जी, बाजरे की रोटी और अलग-अलग क्षेत्रों की पारंपरिक मिठाइयां शामिल हैं।',
    longDescription: 'Rajasthan’s food culture reflects regional ingredients, cooking traditions and the state’s varied landscapes. Dal Baati Churma is one of the best-known dishes associated with Rajasthan, while Ker Sangri represents a distinctive desert-region preparation. Bajra-based breads, gatte and regional sweets are also important parts of the state’s food traditions.',
    longDescriptionRaj: 'राजस्थान री खान-पान संस्कृति में क्षेत्रीय सामग्री, पारंपरिक पकाने की विधियां और अलग-अलग इलाकों री खाद्य परंपराएं शामिल हैं। दाल-बाटी-चूरमा राजस्थान सूं सबसे ज्यादा जुड़ेला व्यंजनां में एक है। केर-सांगरी थार क्षेत्र री खास तैयारी है, जबकि बाजरे री रोटी, गट्टे और क्षेत्रीय मिठाइयां भी राजस्थानी भोजन री पहचान हैं।',
    imageUrl: '/culture/dal_baati_churma.jpg',
    tag: 'Rajasthani Cuisine',
    tagRaj: 'राजस्थानी खान-पान',
    keyHighlights: [
      'Dal Baati Churma is one of Rajasthan’s best-known traditional dishes',
      'Ker Sangri is a distinctive desert-region preparation',
      'Bajra-based breads are an important part of regional food traditions',
      'Gatte and regional sweets add variety to Rajasthan’s cuisine',
    ],
    keyHighlightsRaj: [
      'दाल-बाटी-चूरमा राजस्थान रो प्रसिद्ध पारंपरिक व्यंजन',
      'केर-सांगरी थार क्षेत्र री खास तैयारी',
      'बाजरे री रोटी क्षेत्रीय खान-पान रो महत्वपूर्ण हिस्सा',
      'गट्टे और अलग-अलग मिठाइयां भोजन में विविधता लावै हैं',
    ],
    mayadConnection: 'MAYAD can explore food, lifestyle and regional traditions through documentaries and cultural stories.',
    mayadConnectionRaj: 'मायड़ डॉक्यूमेंट्री और सांस्कृतिक कहानियों के माध्यम से राजस्थानी खान-पान और जीवनशैली को प्रस्तुत कर सकता है।',
  },
];

// ============================================================
// CULTURE PAGE COMPONENT
// ============================================================
export default function CulturePage() {
  const { language } = useApp();
  const isRaj = language === 'RAJ';

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CultureItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Categories Filter Setup
  const categories = [
    { id: 'all', label: 'All Heritage', labelRaj: 'सगळा' },
    { id: 'language', label: 'Language & Dialects', labelRaj: 'मायड़ भाषा' },
    { id: 'dance', label: 'Folk Dances', labelRaj: 'लोक नृत्य' },
    { id: 'music', label: 'Folk Music', labelRaj: 'लोक संगीत' },
    { id: 'heritage', label: 'Forts & Architecture', labelRaj: 'दुर्ग एवं इतिहास' },
    { id: 'festivals', label: 'Fairs & Festivals', labelRaj: 'मेले एवं त्योहार' },
    { id: 'craft', label: 'Arts & Crafts', labelRaj: 'हस्तशिल्प' },
    { id: 'cuisine', label: 'Royal Cuisine', labelRaj: 'खान-पान' },
  ];

  // Filter items based on tab & search query
  const filteredItems = REAL_CULTURE_ITEMS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const title = isRaj ? item.titleRaj : item.title;
    const desc = isRaj ? item.descriptionRaj : item.description;
    const region = isRaj ? item.regionRaj : item.region;

    const matchesSearch =
      searchQuery.trim() === '' ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-mayad-bg text-white pt-28 pb-24 selection:bg-mayad-gold selection:text-black">
      
      {/* ========================================================
          HERO BANNER SECTION
      ======================================================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#0D1226] via-[#121936] to-[#050816] p-8 sm:p-12 md:p-16 shadow-2xl">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-mayad-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mayad-gold/15 border border-mayad-gold/30 text-mayad-gold text-xs font-black tracking-widest uppercase mb-6 shadow-glow-gold"
            >
              <Landmark className="w-4 h-4 text-mayad-gold" />
              <span>{isRaj ? 'मायड़ एवं राजस्थान री प्रामाणिक धरोहर' : 'AUTHENTIC RAJASTHAN & MAYAD HERITAGE'}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-4"
            >
              {isRaj ? (
                <>
                  राजस्थान अर <span className="text-transparent bg-clip-text bg-gradient-to-r from-mayad-gold via-amber-300 to-yellow-500">मायड़ री अस्ली संस्कृति</span>
                </>
              ) : (
                <>
                  Culture & Heritage of <span className="text-transparent bg-clip-text bg-gradient-to-r from-mayad-gold via-amber-300 to-yellow-500">Rajasthan & MAYAD</span>
                </>
              )}
            </motion.h1>

            {/* Tagline Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-8"
            >
              {isRaj
                ? 'हेलो मायड़ भाषा रो | रंगीलो राजस्थान | मारवाड़ी-मेवाड़ी बोलियां, घूमर, कालबेलिया, लांगा संगीत, चित्तौड़गढ़ दुर्ग एवं दाल बाती चूरमा रो पावन संगम।'
                : 'Discover authentic historical facts, traditional music, UNESCO dances, mountain forts, and royal cuisine of Rajasthan proudly celebrated on MAYAD OTT.'}
            </motion.p>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-mayad-gold">100%</span>
                <span className="text-xs text-slate-400 font-medium">{isRaj ? 'प्रामाणिक राजस्थानी तथ्य' : 'Authentic Culture Data'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-white">6+</span>
                <span className="text-xs text-slate-400 font-medium">{isRaj ? 'यूनेस्को धरोहर दुर्ग' : 'UNESCO Hill Forts'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-mayad-gold">10+</span>
                <span className="text-xs text-slate-400 font-medium">{isRaj ? 'मायड़ प्रादेशिक बोलियां' : 'Regional Dialects'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-white">4K</span>
                <span className="text-xs text-slate-400 font-medium">{isRaj ? 'डिजिटल OTT प्रेज़ेंटेशन' : 'HD Cultural Cinema'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SEARCH & CATEGORY FILTER TABS
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-mayad-gold text-black shadow-glow-gold scale-105'
                      : 'bg-[#0D1226] text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat.id === 'all' && <Layers className="w-3.5 h-3.5" />}
                  {cat.id === 'language' && <BookOpen className="w-3.5 h-3.5" />}
                  {cat.id === 'dance' && <Sparkles className="w-3.5 h-3.5" />}
                  {cat.id === 'music' && <Music className="w-3.5 h-3.5" />}
                  {cat.id === 'heritage' && <Landmark className="w-3.5 h-3.5" />}
                  {cat.id === 'festivals' && <Calendar className="w-3.5 h-3.5" />}
                  {cat.id === 'craft' && <Palette className="w-3.5 h-3.5" />}
                  {cat.id === 'cuisine' && <Utensils className="w-3.5 h-3.5" />}
                  <span>{isRaj ? cat.labelRaj : cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRaj ? 'संस्कृति या विषय खोजो...' : 'Search culture topics...'}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0D1226] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-mayad-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          CULTURE CARDS GRID
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-[#0D1226] border border-white/10 rounded-2xl">
            <Landmark className="w-12 h-12 text-mayad-gold mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white">
              {isRaj ? 'कोई सांस्कृतिक विषय नी मिलियो' : 'No culture topics found'}
            </h3>
            <p className="text-slate-400 mt-2 text-sm">
              {isRaj ? 'कृपया दूजी शब्द सूँ खोजो।' : 'Try searching for another keyword or tab.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => {
              const title = isRaj ? item.titleRaj : item.title;
              const subTitle = isRaj ? item.subTitleRaj : item.subTitle;
              const region = isRaj ? item.regionRaj : item.region;
              const desc = isRaj ? item.descriptionRaj : item.description;
              const tag = isRaj ? item.tagRaj : item.tag;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col h-full bg-[#0D1226] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-mayad-gold/50 hover:shadow-glow-gold hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={item.imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-black/20 to-transparent opacity-90" />

                    {/* Tag Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3 py-1 bg-mayad-gold text-black text-xs font-extrabold rounded-full uppercase tracking-wider shadow-md">
                        {tag}
                      </span>
                    </div>

                    {/* Region Pill */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="flex items-center gap-1.5 truncate font-medium text-amber-300">
                        <Compass className="w-3.5 h-3.5 flex-shrink-0 text-mayad-gold" />
                        <span className="truncate">{region}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-xs font-bold text-mayad-gold uppercase tracking-wider mb-1">
                        {subTitle}
                      </p>

                      <h3 className="text-xl font-black text-white group-hover:text-mayad-gold transition-colors leading-snug">
                        {title}
                      </h3>

                      <p className="text-sm text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        {isRaj ? 'प्रामाणिक सांस्कृतिक धरोहर' : 'Authentic Heritage'}
                      </span>

                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-mayad-gold hover:text-black text-xs font-bold text-mayad-gold transition-all duration-200"
                      >
                        <span>{isRaj ? 'विस्तार सूँ पढ़ो' : 'Explore Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================
          CULTURE & MAYAD OTT FEATURE BANNER
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-mayad-gold/30 bg-gradient-to-r from-blue-950 via-[#0D1226] to-[#050816] p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-mayad-gold text-xs font-black uppercase tracking-widest mb-3">
                <Crown className="w-4 h-4" />
                <span>{isRaj ? 'मायड़ OTT री प्रतिज्ञा' : 'MAYAD OTT MISSION'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {isRaj
                  ? 'मायड़ भाषा और राजस्थानी सिनेमा ने वैश्विक पहचान देवाणो'
                  : 'Preserving Authentic Rajasthani Heritage for Global Audiences'}
              </h2>

              <p className="text-slate-300 mt-4 text-sm sm:text-base leading-relaxed">
                {isRaj
                  ? 'मायड़ केवल एक OTT एप नी है, इण राजस्थान री माटी, बोली, संगीत और शूरवीरों री कहानियों ने 4K HDR में दुनिया तांई पहुँचावा रो एक डिजिटल क्रांति है।'
                  : 'MAYAD is not just a streaming service—it is a cultural movement dedicated to bringing Rajasthani films, folk music, historical epics, and regional artists to screens worldwide.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/movies"
                className="px-6 py-3.5 rounded-xl bg-mayad-gold text-black text-sm font-extrabold shadow-glow-gold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRaj ? 'सांस्कृतिक फ़िल्मां देखो' : 'Stream Culture Cinema'}</span>
              </Link>

              <Link
                href="/about"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/10 transition-all text-center"
              >
                <span>{isRaj ? 'मायड़ री बात' : 'About MAYAD Mission'}</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE DETAIL MODAL
      ======================================================== */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-[#0D1226] border border-mayad-gold/40 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Header Image */}
              <div className="relative h-64 sm:h-80 w-full bg-slate-900 flex-shrink-0">
                <Image
                  src={selectedItem.imageUrl}
                  alt={isRaj ? selectedItem.titleRaj : selectedItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1226] via-[#0D1226]/40 to-transparent" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-mayad-gold hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-mayad-gold text-black text-xs font-black rounded-full uppercase tracking-wider mb-2 inline-block shadow-md">
                    {isRaj ? selectedItem.tagRaj : selectedItem.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {isRaj ? selectedItem.titleRaj : selectedItem.title}
                  </h2>
                  <p className="text-sm font-semibold text-mayad-gold mt-1">
                    {isRaj ? selectedItem.subTitleRaj : selectedItem.subTitle}
                  </p>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
                {/* Region */}
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                  <Compass className="w-4 h-4 text-mayad-gold" />
                  <span>{isRaj ? selectedItem.regionRaj : selectedItem.region}</span>
                </div>

                {/* Long Description */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    {isRaj ? 'सांस्कृतिक विवरण एवं इतिहास' : 'Cultural History & Significance'}
                  </h4>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {isRaj ? selectedItem.longDescriptionRaj : selectedItem.longDescription}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="bg-[#050816] p-5 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-black uppercase tracking-wider text-mayad-gold mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{isRaj ? 'मुख्य प्रामाणिक विशेषताएं' : 'Authentic Key Highlights'}</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(isRaj ? selectedItem.keyHighlightsRaj : selectedItem.keyHighlights).map((hl, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <ShieldCheck className="w-4 h-4 text-mayad-gold flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* MAYAD Connection Note */}
                <div className="bg-gradient-to-r from-mayad-gold/10 via-amber-500/10 to-transparent p-4 rounded-2xl border border-mayad-gold/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mayad-gold flex items-center justify-center text-black flex-shrink-0 font-bold">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {isRaj ? 'मायड़ OTT कनेक्शन' : 'MAYAD OTT Connection'}
                      </p>
                      <p className="text-xs text-slate-300">
                        {isRaj ? selectedItem.mayadConnectionRaj : selectedItem.mayadConnection}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/movies"
                    onClick={() => setSelectedItem(null)}
                    className="px-3 py-1.5 rounded-lg bg-mayad-gold text-black text-xs font-bold hover:bg-yellow-400 transition-colors flex-shrink-0"
                  >
                    {isRaj ? 'देखें' : 'Watch Now'}
                  </Link>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-[#050816] flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {isRaj ? 'मायड़ - राजस्थान रो पेलो समर्पित OTT' : 'MAYAD - First Dedicated Rajasthani OTT'}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  {isRaj ? 'बंद करो' : 'Close'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
