import test from 'tape';
import db, {clearDB} from '../../server/database';

test('database clear', t => {
  const onClear = () =>{
    const dataList = [];
    let error;
    db.createReadStream({
      start: '\x00',
      end: '\xFF'
    }).on('data', (data) => {
      dataList.push(data.value);
    }).on('error', (err) => {
      error = err;
    }).on('close', () => {
      if (error) {
        t.fail('Internal database error');
        return t.end();
      }
      if (dataList.length > 0) {
        t.fail('database is not empty');
        return t.end();
      }
      t.pass('database is empty');
      return t.end();
    });
  };
  clearDB().then(onClear);
});
