import ItemAlbum from './ItemAlbum';
import { View, Text, ScrollView, TouchableNativeFeedback } from 'react-native';
import { ArtistTrend } from '../screens/NewApp/index';
import { memo } from 'react';
import { COLORS } from '../constants';

type Props = {
  name: string;
  data: Array<ArtistTrend>;
};
const ListItem = ({ data, name }: Props) => {
  return (
    <View style={{ flexDirection: 'column', paddingTop: 15 }}>
      <View>
        <Text style={{ fontSize: 25, color: 'black' }}>{name}</Text>
      </View>
      <ScrollView
        style={{ paddingBottom: 10 }}
        horizontal={true}
        disableScrollViewPanResponder={true}
        showsHorizontalScrollIndicator={false}>
        {data && data.length > 0 ? (
          data.map((item, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
              // onPress={() => playSongInPlaylist(item, index)}
              >
                <View>
                  <ItemAlbum description={item.title} image={item?.thumbnail ? item.thumbnail : 'cccc'} size={120} key={index} />
                </View>
              </TouchableNativeFeedback>
            )
          })
        ) : (
          <View style={{ height: 120 }}>
            <Text style={{ paddingLeft: 10 }}>Chưa có mục nào</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default memo(ListItem);
