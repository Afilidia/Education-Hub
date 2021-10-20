let framework = require('../framework'),
style = {
  '.noselect': {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none'
  },
  '*': { boxSizing: 'border-box' },
  body: { padding: '0px', margin: '0px', backgroundColor: '#323232' },
  '.container': {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0'
  },
  '.btn': {
    textDecoration: 'none',
    fontFamily: "'Open Sans', sans-serif",
    padding: '10px 18px',
    transition: 'all 300ms linear',
    borderRadius: '5px',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none',
    border: 'solid 2px #1e90ff',
    margin: '5px 2px'
  },
  '.btn:hover': { cursor: 'pointer' },
  '.btn-text': {
    fontSize: '16px',
    color: '#1e90ff',
    fontWeight: '600',
    transition: 'all 300ms linear'
  },
  '.bar': {
    width: '40%',
    height: '1px',
    backgroundColor: '#fff',
    margin: '20px 0'
  },
  '.common-btn': {
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#2ed573',
    transition: 'all 300ms ease'
  },
  '.common-btn .btn-text': { color: '#323232' },
  '.common-btn:hover': { backgroundColor: '#20a055' },
  '.faded-btn': {
    borderRadius: '15px',
    border: 'solid 2px #7649fe',
    backgroundColor: 'transparent'
  },
  '.faded-btn .btn-text': { color: '#7649fe' },
  '.faded-btn:hover': { backgroundColor: '#7649fe' },
  '.faded-btn:hover .btn-text': { color: '#323232' },
  '.reverse-faded-btn': {
    borderRadius: '15px',
    border: 'solid 2px #7649fe',
    backgroundColor: '#7649fe'
  },
  '.reverse-faded-btn .btn-text': { color: '#323232' },
  '.reverse-faded-btn:hover': { backgroundColor: '#323232' },
  '.reverse-faded-btn:hover .btn-text': { color: '#7649fe' },
  '.glowing-btn': {
    borderRadius: '15px',
    backgroundColor: '#ff6b81',
    border: 'none',
    transition: 'transform 100ms linear, box-shadow 180ms linear'
  },
  '.glowing-btn .btn-text': { color: '#323232' },
  '.glowing-btn:hover': {
    position: 'relative',
    transform: 'translateY(-3px) scale(1.01)',
    boxShadow: '0 5px 15px #ff6b81'
  },
  '.rounded-btn': {
    backgroundColor: '#5352ed',
    border: 'none',
    transition: 'all 200ms linear'
  },
  '.rounded-btn .btn-text': { color: '#323232' },
  '.rounded-btn:hover': { borderRadius: '15px' },
  '.toggle-btn': {
    backgroundColor: '#ffde74',
    border: 'none',
    boxShadow: '0 3px 0 0 #009432'
  },
  '.toggle-btn .btn-text': { color: '#323232' },
  '.toggle-btn.toggle': { backgroundColor: '#009432' },
  '.toggle-btn:active': { position: 'relative', top: '3px', boxShadow: 'none' },
  '.multi-choice-buttons-wrapper': {
    width: '90%',
    height: 'auto',
    minHeight: '100px',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    userSelect: 'none'
  },
  '.multi-choice-buttons-wrapper .option': {
    border: 'none',
    borderRadius: '20px',
    padding: '12px 30px',
    background: 'none',
    transition: 'all 300ms ease-in-out',
    margin: '0 2vw'
  },
  '.multi-choice-buttons-wrapper .option.active': {
    backgroundImage: 'linear-gradient(135deg, #74b9ff, #0984e3)',
    transition: 'all 300ms ease-in-out'
  },
  '.multi-choice-buttons-wrapper .option .option-text': { color: '#fff', fontWeight: '500', fontSize: '16px' }
};
module.exports = framework.css.stringify(style);