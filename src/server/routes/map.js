import express from 'express';

const router = express.Router();

router.get('/getmarkers', (req, res) => {	

	let markersData = [
		{
			id: 'red selo',
	        lat: 37.563398,
	        lng: 126.9907941,
	        title: 'KRASNOYE SELO CIRCLE',
	        description: 'circle',
	        address: 'circle',        
	        type: 0        
		},
		{
			id: 'alaska',
	        lat: 37.565398,
	        lng: 126.9907941,
	        title: 'ALASKA',
	        description: 'alaska',
	        address: 'alaska',        
	        type: 0   
		}
	];

	res.json(markersData);	
});

export default router;