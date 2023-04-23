import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import Banner from '../../components/Banner';
import BoxSearch from '../../components/BoxSearch';
import ListItem from '../../components/ListItem';
import LineChartBox from './LineChartBox';
import { ZingMp3 } from '../../ZingMp3';
import { banner } from '../../components/Banner';
import { NewRelease } from './NewRelease';

type ItemHome = {
  sectionType: string,
  viewType?: string,
  sectionId: string,
  title?: string,
  items?: [],
}

type Artist = {
  id: string,
  name: string,
  link: string,
  spotlight: boolean,
  alias: string,
  thumbnail: string,
  thumbnailM: string,
  isOA: boolean,
  isOABrand: boolean,
  playlistId: string,
  totalFollow: number
}

export type ArtistTrend = {
  encodeId: string,
  thumbnail: string,
  thumbnailM?: string,
  link: string,
  title: string,
  sortDescription: string,
  artists: Artist[],
  artistsNames: string
}

export type Release = ArtistTrend & {
  artistsNames: string,
  alias: string,
  releaseDate: number,
  isWorldWide: boolean,
}

const NewApp = memo(() => {
  const [banners, setBanners] = useState<banner[]>([])
  const [playlist, setPlaylist] = useState<ArtistTrend[]>([]);
  const [top100, setTop100] = useState<ArtistTrend[]>([])
  const [hAlbum, setHAlbum] = useState<ArtistTrend[]>([]);
  const [weekends, setWeekends] = useState<ArtistTrend[]>([])
  const [releases, setReleases] = useState<Release[]>([])

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  const getItem = (data: Array<ItemHome>, sectionId: string): ItemHome[] => {
    return data.filter(item => item.sectionId === sectionId)
  }

  const getData = async () => {
    const res = await ZingMp3.getHome();
    const data = res.data.items;
    const banner: ItemHome[] = getItem(data, 'hSlider');
    const artistTrend: ItemHome[] = getItem(data, 'hArtistTheme');
    const top100: ItemHome[] = getItem(data, 'h100')
    const hAlbum: ItemHome[] = getItem(data, 'hAlbum')
    const weekends: ItemHome[] = getItem(data, 'hEditorTheme2');
    const newRelease = data.find((item: ItemHome) => item.sectionType === 'new-release');

    setBanners(banner && banner.length > 0 && banner[0]?.items ? banner[0].items : [])
    setPlaylist(artistTrend && artistTrend.length > 0 && artistTrend[0]?.items ? artistTrend[0].items : [])
    setTop100(top100 && top100.length > 0 && top100[0]?.items ? top100[0].items : [])
    setHAlbum(hAlbum && hAlbum.length > 0 && hAlbum[0]?.items ? hAlbum[0].items : [])
    setWeekends(weekends && weekends.length > 0 && weekends[0]?.items ? weekends[0].items : [])
    setReleases(newRelease?.items?.all ? newRelease.items.all : [])
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{ backgroundColor: 'transparent' }}>
          <Banner data={banners}>
            <View>
              <StatusBar
                barStyle={'light-content'}
                translucent
                backgroundColor={'transparent'}
                animated={true}
              />
              <BoxSearch />
            </View>
          </Banner>
          <View
            style={{
              paddingHorizontal: 10,
            }}>
            <ListItem data={playlist} name={'Nghệ sĩ thịnh hành'} />
            <ListItem data={weekends} name={'Happy Weekend'} />
            <NewRelease releases={releases} />
            <LineChartBox />
            <ListItem data={top100} name={'Top 100'} />
            <ListItem data={hAlbum} name={'Album hot >'} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default NewApp;
