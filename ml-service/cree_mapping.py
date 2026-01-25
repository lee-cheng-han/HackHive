# Basic Cree Syllabics to Romanization Mapping
# This is a simplified mapping - you may need to adjust based on your training data

CREE_SYLLABIC_TO_ROMAN = {
    # Basic vowels
    'ᐊ': 'a',
    'ᐃ': 'i', 
    'ᐅ': 'o',
    'ᐈ': 'â',
    'ᐄ': 'î',
    'ᐆ': 'ô',
    
    # p- series
    'ᐸ': 'pa',
    'ᐱ': 'pi',
    'ᐳ': 'po',
    'ᐹ': 'pâ',
    'ᐲ': 'pî', 
    'ᐴ': 'pô',
    'ᑉ': 'p',
    
    # t- series  
    'ᑕ': 'ta',
    'ᑖ': 'tâ',  # This is the first character in ᑖᓂᓯ
    'ᑎ': 'ti',
    'ᑏ': 'tî',
    'ᑐ': 'to',
    'ᑑ': 'tô',
    'ᑦ': 't',
    
    # k- series
    'ᑲ': 'ka',
    'ᑭ': 'ki',
    'ᑯ': 'ko', 
    'ᑳ': 'kâ',
    'ᑮ': 'kî',
    'ᑰ': 'kô',
    'ᒃ': 'k',
    
    # c- series
    'ᒐ': 'ca',
    'ᒋ': 'ci',
    'ᒍ': 'co',
    'ᒑ': 'câ',
    'ᒌ': 'cî',
    'ᒎ': 'cô',
    'ᒡ': 'c',
    
    # m- series
    'ᒪ': 'ma',
    'ᒥ': 'mi',
    'ᒧ': 'mo',
    'ᒫ': 'mâ',
    'ᒦ': 'mî',
    'ᒨ': 'mô',
    'ᒢ': 'm',
    
    # n- series
    'ᓇ': 'na',
    'ᓂ': 'ni',  # This is the second character in ᑖᓂᓯ
    'ᓄ': 'no',
    'ᓈ': 'nâ',
    'ᓃ': 'nî',
    'ᓅ': 'nô',
    'ᓐ': 'n',
    
    # s- series
    'ᓴ': 'sa',
    'ᓯ': 'si',  # This is the third character in ᑖᓂᓯ
    'ᓱ': 'so',
    'ᓵ': 'sâ',
    'ᓰ': 'sî',
    'ᓲ': 'sô',
    'ᔅ': 's',
    
    # l- series
    'ᓚ': 'la',
    'ᓕ': 'li',
    'ᓗ': 'lo',
    'ᓛ': 'lâ',
    'ᓖ': 'lî',
    'ᓘ': 'lô',
    'ᓪ': 'l',
    
    # y- series
    'ᔭ': 'ya',
    'ᔨ': 'yi',
    'ᔪ': 'yo',
    'ᔮ': 'yâ',
    'ᔩ': 'yî',
    'ᔫ': 'yô',
    'ᕀ': 'y',
    
    # r- series  
    'ᕋ': 'ra',
    'ᕆ': 'ri',
    'ᕈ': 'ro',
    'ᕌ': 'râ',
    'ᕇ': 'rî',
    'ᕉ': 'rô',
    'ᕐ': 'r',
    
    # w- series
    'ᐘ': 'wa',
    'ᐧᐃ': 'wi',
    'ᐧᐅ': 'wo',
    'ᐧᐊ': 'wâ',
    'ᐧᐄ': 'wî',
    'ᐧᐆ': 'wô',
    
    # Space and punctuation
    ' ': ' ',
    '.': '.',
    ',': ',',
    '?': '?',
    '!': '!',
}

def syllabics_to_romanized(cree_text: str) -> str:
    """Convert Cree syllabics to romanized form."""
    result = []
    for char in cree_text:
        if char in CREE_SYLLABIC_TO_ROMAN:
            result.append(CREE_SYLLABIC_TO_ROMAN[char])
        else:
            # If character not found, keep it as is
            result.append(char)
    
    romanized = ''.join(result)
    print(f"Syllabics '{cree_text}' → Romanized '{romanized}'")
    return romanized