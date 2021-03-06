import { ResponsivePie } from '@nivo/pie';
import { useState, useEffect } from 'react';
import { Container } from './styles';

//-------------------------------------------
const PieGraph = ({ emotionsImage }) => {
    const [treatedEmotionsData, setTreatedEmotionsData] = useState([]);

    useEffect(() => {
        let infoHolder = [];
        for (const emotion in emotionsImage) {
            infoHolder.push({
                id: emotion,
                label: emotion,
                value: emotionsImage[emotion]
            });
        }
        setTreatedEmotionsData(infoHolder);

        //eslint-disable-next-line
    }, [emotionsImage]);

    return (
        <Container>
            <div style={{ width: '100%', height: '100%', margin: '0 auto' }}>
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
        </Container>
    );
};

export default PieGraph;
