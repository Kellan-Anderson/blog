export default function generateUID(idType: 
  ('blog' | 'category' | 'image' | 'comment' | 'tag' | 'user'),
  length=6
) {

  const key = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a',
    'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1',
    '2', '3', '4', '5', '6', '7', '8', '9'
  ]

  var prefix = '';

  switch(idType) {
    case 'blog': 
      prefix = 'b_' 
      break;
    case 'category':
      prefix = 'ct_';
      break
    case 'comment':
      prefix = 'cm_';
      break;
    case 'image':
      prefix = 'im_'
      break;
    case 'tag':
      prefix = 't_'
      break
    case 'user':
      prefix = 'u_'
      break
    default:
      prefix = '_'
  }

  var uid = '';
  for(var i = 0; i < length; i++) {
    const randChar = Math.random()
    uid += key.at(i);
  }

  return `${prefix}${uid}`;
}