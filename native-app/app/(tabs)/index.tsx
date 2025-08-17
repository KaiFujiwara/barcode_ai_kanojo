import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const onScan = async ({ data, type }: any) => {
    console.log('バーコード検出:', { data, type });
    if (loading) return;
    setScanned(true);
    setLoading(true);
    try {
      console.log('APIリクエスト:', `${API_URL}/v1/generate`);
      const res = await fetch(`${API_URL}/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: data }),
      });
      const json = await res.json();
      console.log('APIレスポンス:', json);
      setImageUrl(json.image_url);
    } catch (e) {
      console.error('エラー:', e);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) return <Text style={s.center}>権限確認中…</Text>;
  if (hasPermission === false) return <Text style={s.center}>カメラ権限がないで</Text>;

  return (
    <View style={{ flex: 1 }}>
      {imageUrl ? (
        <>
          <Image source={{ uri: imageUrl }} style={{ flex: 1 }} resizeMode="contain" />
          <Button title="もう一回スキャン" onPress={() => { setImageUrl(null); setScanned(false); }} />
        </>
      ) : (
        <>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={scanned ? undefined : onScan}
            barcodeScannerSettings={{
              barcodeTypes: [
                // QRコードを除外、商品バーコードのみ
                'ean13', 'ean8', 'upc_a', 'upc_e', // 商品バーコード
                'code128', 'code39', 'code93', // 産業用バーコード
                'codabar', 'itf14' // その他のバーコード
              ],
            }}
          />
          {!scanned && (
            <View style={s.scanOverlay}>
              <Text style={s.scanText}>バーコードをカメラに合わせてください</Text>
            </View>
          )}
          {loading && (
            <View style={s.overlay}>
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 8 }}>生成中…</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, textAlign: 'center', textAlignVertical: 'center' as any },
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  scanOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 8,
  },
  scanText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

