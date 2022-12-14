import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Item = ({ name, email, bidang, onPress, onDelete }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: `https://ui-avatars.com/api/?name=${name}` }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.desc}>
        <Text style={styles.descName}>{name}</Text>
        <Text style={styles.descEmail}>{email}</Text>
        <Text style={styles.descBidang}>{bidang}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const LocalAPI = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bidang, setBidang] = useState('');
  const [users, setUsers] = useState([]);
  const [button, setButton] = useState('Simpan');
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const submit = () => {
    const data = {
      name,
      email,
      bidang,
    };

    if (button === 'Simpan') {
      axios.post('http://10.0.2.2:3004/users', data).then((res) => console.log('res post: ', res));
      setName('');
      setEmail('');
      setBidang('');
      getData();
    } else {
      axios.put(`http://10.0.2.2:3004/users/${selectedUser.id}`, data).then((res) => {
        console.log('res update: ', res);
        setName('');
        setEmail('');
        setBidang('');
        getData();
        setButton('Simpan');
      });
    }
  };

  const getData = async () => {
    const response = await axios.get('http://10.0.2.2:3004/users');
    console.log('res get: ', response.data);
    console.log('users: ', users);
    setUsers(response.data);
  };

  const selectItem = (item) => {
    console.log('selected item: ', item);
    setSelectedUser(item);
    setName(item.name);
    setEmail(item.email);
    setBidang(item.bidang);
    setButton('Update');
  };

  const deleteItem = async (item) => {
    console.log(item);
    const response = await axios.delete(`http://10.0.2.2:3004/users/${item.id}`);
    console.log('res delete: ', response);
    await getData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Local API (JSON Server)</Text>
      <Text style={styles.textSubtitle}>Masukkan Anggota</Text>
      <TextInput
        placeholder="Nama"
        style={styles.input}
        value={name}
        onChangeText={(value) => setName(value)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(value) => setEmail(value)}
      />
      <TextInput
        placeholder="Bidang"
        style={styles.input}
        value={bidang}
        onChangeText={(value) => setBidang(value)}
      />
      <View style={styles.button}>
        <Button title={button} onPress={submit} />
      </View>
      <View style={styles.line} />
      {users.map((user) => {
        return (
          <Item
            key={user.id}
            name={user.name}
            email={user.email}
            bidang={user.bidang}
            onPress={() => selectItem(user)}
            onDelete={() => {
              Alert.alert('Peringatan', 'Anda yakin akan menghapus user ini?', [
                { text: 'Tidak', onPress: () => console.log('Button tidak') },
                { text: 'Ya', onPress: () => deleteItem(user) },
              ]);
            }}
          />
        );
      })}
    </View>
  );
};

export default LocalAPI;

const styles = StyleSheet.create({
  container: { padding: 16 },
  textTitle: { textAlign: 'center' },
  textSubtitle: { marginTop: 16 },
  line: { height: 2, backgroundColor: 'black', marginVertical: 20 },
  input: { borderWidth: 1, marginTop: 8, borderRadius: 8, paddingHorizontal: 16 },
  button: { marginTop: 8 },
  avatar: { width: 80, height: 80, borderRadius: 100 },
  itemContainer: { flexDirection: 'row', marginBottom: 16 },
  desc: { marginLeft: 16, flex: 1 },
  descName: { fontSize: 20, fontWeight: 'bold' },
  descEmail: { fontSize: 16 },
  descBidang: { fontSize: 12, marginTop: 8 },
  delete: { fontSize: 20, fontWeight: 'bold', color: 'red' },
});
