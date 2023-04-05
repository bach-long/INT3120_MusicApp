import RNFS from 'react-native-fs';
import notifee, {AndroidImportance} from '@notifee/react-native';
import * as MediaLibrary from 'expo-media-library';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import TrackPlayer, {Track} from 'react-native-track-player';

class FileSystem {
  private BASE_PATH = RNFS.ExternalDirectoryPath + '/';

  constructor() {}

  public downloadFileToExternalStorage = async (url: string, fileName: string) => {
    try {
      const path = this.BASE_PATH + fileName;
      const channelId = await notifee.createChannel({
        id: 'download',
        name: 'Download Channel',
        vibration: false,
        importance: AndroidImportance.HIGH,
      });
      let shouldDisplayNotification = true;
      const download = await RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
        progressInterval: 500,
        progress: async res => {
          console.log(res.bytesWritten, res.contentLength);

          if (shouldDisplayNotification) {
            shouldDisplayNotification = false;
            await notifee.displayNotification({
              id: String(res.jobId),
              title: 'Downloading ' + fileName + '...',
              body: `${Math.round((res.bytesWritten / res.contentLength) * 100)}% ${
                Math.round((res.bytesWritten / 1024 / 1024) * 100) / 100
              }/${Math.round((res.contentLength / 1024 / 1024) * 100) / 100} MB`,
              android: {
                channelId,
                progress: {
                  max: res.contentLength,
                  current: res.bytesWritten,
                },
                importance: AndroidImportance.HIGH,
              },
            });
            shouldDisplayNotification = true;
          }
        },
        background: true,
      }).promise;
      console.log('Downloaded:', download);
      shouldDisplayNotification = false;
      await notifee.cancelNotification(String(download.jobId));
    } catch (error) {
      console.log('Downloader/downloadFileToExternalStorage:', error);
    }
  };

  public getMusicFiles = async () => {
    try {
      const tracks: Track[] = [];

      const files = await RNFS.readDir(this.BASE_PATH);
      console.log(files);

      // Xóa folder /copied nếu đã tồn tại
      const copiedPath = this.BASE_PATH + 'copied';
      const existCopied = await RNFS.exists(copiedPath);
      if (existCopied) {
        await RNFS.unlink(copiedPath);
      }
      await RNFS.mkdir(copiedPath);

      // Copy các file audio vào folder /copied
      let media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
      });
      const assets = media.assets.filter(item => item.duration > 5);
      await Promise.all(
        assets.map(async item => {
          const outputImage = copiedPath + '/' + item.filename + '.jpg';
          const outputMetadata = copiedPath + '/' + item.filename + '.txt';
          await FFmpegKit.execute(`-i ${item.uri} -an -vcodec copy ${outputImage}`);
          await FFmpegKit.execute(`-i ${item.uri} -f ffmetadata ${outputMetadata}`);
          const metadata = await RNFS.readFile(outputMetadata, 'utf8');
          const titleMatch = metadata.match(/Title=([^=\n]+)/);
          const artistMatch = metadata.match(/Artist=([^=\n]+)/);
          tracks.push({
            url: item.uri,
            artwork: 'file://' + outputImage,
            title: titleMatch ? titleMatch[1] : item.filename,
            artist: artistMatch ? artistMatch[1] : 'Unknown',
          });
          await RNFS.unlink(outputMetadata);
        }),
      );
      console.log(tracks);
      // await TrackPlayer.reset();
      // await TrackPlayer.add(tracks);

      // const session = await FFmpegKit.execute(
      //   '-i /storage/emulated/0/Download/starwalkin.flac -an -vcodec copy /storage/emulated/0/Download/cover.jpg',
      // );
      // const command = session.getCommand();
      // console.log(command);
      return tracks;
    } catch (error) {
      console.log('Downloader/getMusicFiles:', error);
    }
  };

  public checkMediaPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.granted) {
      // await this.getAudioFiles();
      return;
    }

    if (!permission.granted && !permission.canAskAgain) {
      throw new Error('Bạn đã từ chối quyền truy cập thư viện');
    }

    if (!permission.granted && permission.canAskAgain) {
      const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        // await this.getAudioFiles();
        return;
      }

      if (status === 'denied') {
        throw new Error('Bạn đã từ chối quyền truy cập thư viện');
      }
    }
  };
}

export default new FileSystem();
