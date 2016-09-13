import express from 'express';

const router = express.Router();

router.get('/getmarkers', (req, res) => {
  const markersData = [
    {
      id: 'red selo',
      lat: 37.563398,
      lng: 126.9907941,
      title: 'KRASNOYE SELO CIRCLE',
      eventtime: '11:00 am - 4:00 pm',
      address: '14 Mission St.Palo Alto, CA',
      type: 0
    },
    {
      id: 'alaska',
      lat: 37.565398,
      lng: 126.9907941,
      title: 'ALASKA',
      eventtime: '09:00 am - 2:00 pm',
      address: '광화문 명당',
      type: 0
    }
  ];
  res.json(markersData);
});

export default router;
