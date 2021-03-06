import { ResponsivePie } from '@nivo/pie';
import { useEmotions } from '../../providers/Emotions';
import { useState, useEffect } from 'react';

const PieGraphVideo = () => {
    const { emotionsVideo } = useEmotions();
    const [treatedEmotionsData, setTreatedEmotionsData] = useState([]);

    useEffect(() => {
        let infoHolder = treatedEmotionsData;
        for (const emotionData in emotionsVideo) {
            infoHolder.push({
                id: emotionData,
                label: emotionData,
                value: (
                    emotionsVideo[emotionData].reduce((accumulator, currentValue) => {
                        return accumulator + parseFloat(currentValue);
                    }, 0) / emotionsVideo[emotionData].length
                ).toFixed(2)
            });
            console.log(emotionData);
        }
        setTreatedEmotionsData(infoHolder);
        //eslint-disable-next-line
    }, [emotionsVideo]);

    return (
        <div style={{ width: '400px', height: '400px' }}>
            <ResponsivePie
                data={treatedEmotionsData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={[
                    '#C60000',
                    '#7EBA00',
                    '#FFF448',
                    '#2780B9',
                    '#CCCCCC',
                    '#13365A',
                    '#FF00FF'
                ]}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextColor="#ffffff"
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#000"
            />
        </div>
    );
};

export default PieGraphVideo;
