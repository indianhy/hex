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

const HEARTS_UINT_SHIFT = BigInt(72);
const HEARTS_MASK = BigInt((BigInt(1) << HEARTS_UINT_SHIFT) - BigInt(1));
const SATS_UINT_SHIFT = BigInt(56);
const SATS_MASK = BigInt((BigInt(1) << SATS_UINT_SHIFT) - BigInt(1));
//console.log({HEARTS_UINT_SHIFT,HEARTS_MASK,SATS_UINT_SHIFT,SATS_MASK})
const decodeDailyDatax = (encDay) => {
  try {
    let v = BigInt(encDay);
    let payout = v & HEARTS_MASK;
    console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, payout });
    v = v >> HEARTS_UINT_SHIFT;
    //v = BigInt(v.value >> HEARTS_UINT_SHIFT.value);
    let shares = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, payout, shares });
    //v = BigInt(v.value >> HEARTS_UINT_SHIFT.value);
    let sats = v & SATS_MASK;
    console.log({ payout, shares, sats });
    return {
      payout: parseInt(payout),
      shares: parseInt(shares),
      sats: parseInt(sats),
    };
  } catch (e) {
    throw new Error(e);
  }
};

const decodeDailyData = (encDay) => {
  let v = BigInt(encDay);
  let payout = v.value & HEARTS_MASK.value;
  console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, payout })
  v = v.shiftRight(HEARTS_UINT_SHIFT);
  //v = BigInt(v.value >> HEARTS_UINT_SHIFT.value);
  let shares = v.value & HEARTS_MASK.value;
  v = v.shiftRight(HEARTS_UINT_SHIFT);
  //console.log({ v, HEARTS_UINT_SHIFT, HEARTS_MASK, payout, shares })
  //v = BigInt(v.value >> HEARTS_UINT_SHIFT.value);
  let sats = v.value & SATS_MASK.value;
  //console.log({ payout, shares, sats });
  return { payout: parseInt(payout), shares: parseInt(shares), sats: parseInt(sats), };
};

app.get('/ddd/:encDay', function (req, res) {
  var metadata = decodeDailyData(req.params.encDay);
  res.send(metadata);
})

app.get('/', function (req, res) {
  var metadata = { payout: 0, shares: 0, sats: 0, };
  res.send(metadata);
})

app.get('/ddd', function (req, res) {
  var metadata = { payout: 0, shares: 0, sats: 0, };
  res.send(metadata);
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})