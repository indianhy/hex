const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors');
const BigInt = require('big-integer')


const PORT = process.env.PORT || 5005

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Static public files 39843667585415780254295230251369992668648887569988387513119n
app.use(express.static(path.join(__dirname, 'public')))

//console.log({HEARTS_UINT_SHIFT,HEARTS_MASK,SATS_UINT_SHIFT,SATS_MASK})


const HEARTS_UINT_SHIFT = BigInt(72);
const HEARTS_MASK = (BigInt(1) << HEARTS_UINT_SHIFT) - BigInt(1);
const SATS_UINT_SHIFT = BigInt(56);
const SATS_MASK = (BigInt(1) << SATS_UINT_SHIFT) - BigInt(1);
const decodeDailyData = (encDay) => {
  let v = BigInt(encDay).value;
  console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, });
  let payout = v & HEARTS_MASK;
  console.log({ v, payout });
  v = v >> HEARTS_UINT_SHIFT;
  let shares = v & HEARTS_MASK;
  v = v >> HEARTS_UINT_SHIFT;
  let sats = v & SATS_MASK;
  //return { payout: BigInt(payout), shares: BigInt(shares), sats: BigInt(sats), };
  return { payout, shares, sats };
}


const getDataRange = async (dataRange) => {
  //const dataRange = await hex.methods.dailyDataRange(b, e).call();
  //console.log('1', dataRange);
  const data = [];
  for (let i = 0; i < dataRange.length; i++) {
    var res = decodeDailyData(dataRange[i]);
    data.push(res);
    //console.log({ dataRange: dataRange[i], decoded: decodeDailyData(dataRange[i])})
  }
  return data;
};


app.post('/data/', function (req, res) {
  var result = getDataRange(req.body.data);
  res.send(result);
})

app.get('/', function (req, res) {
  var metadata = { payout: 0, shares: 0, sats: 0, };
  res.send(metadata);
})

app.get('/data', function (req, res) {
  var metadata = { payout: 0, shares: 0, sats: 0, };
  res.send(metadata);
})

console.log(decodeDailyData('39843667585415780254295230251369992668648887569988387513119'))

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})

// const decodeDailyData = (encDay) => {
//   const HEARTS_UINT_SHIFT = BigInt(72);
//   const HEARTS_MASK = BigInt((BigInt(1) << HEARTS_UINT_SHIFT) - BigInt(1));
//   const SATS_UINT_SHIFT = BigInt(56);
//   const SATS_MASK = BigInt((BigInt(1) << SATS_UINT_SHIFT) - BigInt(1));

//   let v = BigInt(encDay);
//   let payout = v.and(HEARTS_MASK);
//   console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, payout })
//   v = v.shiftRight(HEARTS_UINT_SHIFT);
//   //v = BigInt(v.value >> HEARTS_UINT_SHIFT.value);
//   let shares = v.and(HEARTS_MASK);
//   v = v.shiftRight(HEARTS_UINT_SHIFT);
//   //console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, payout, shares })
//   //v = BigInt(v.value >> HEARTS_UINT_SHIFT.value);
//   let sats = v.and(SATS_MASK);
//   //console.log({ payout, shares, sats });
//   return { payout: parseInt(payout), shares: parseInt(shares), sats: parseInt(sats), };
// };
