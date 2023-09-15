export default function generateUID(idType: 
  ('blog' | 'category' | 'image' | 'comment' | 'tag' | 'user' | 'draft'),
  length=6
) {

  const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

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
    case 'draft':
      prefix = 'd_'
      break
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
    const randChar = (Math.floor(Math.random() * key.length))
    uid += key.at(randChar);
  }

  return `${prefix}${uid}`;
}