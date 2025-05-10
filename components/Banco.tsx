import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

const Banco = () => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [tabelaCriada, setTabelaCriada] = useState(false);
    const [idAlterar, setIdAlterar] = useState('');
    const [novoNome, setNovoNome] = useState('');

    const verificarBancoETabela = () => {
        if (!db) {
            const msg = 'Crie o banco primeiro!';
            Alert.alert('Atenção', msg);
            console.warn(msg);
            return false;
        }
        if (!tabelaCriada) {
            const msg = 'Crie a tabela primeiro!';
            Alert.alert('Atenção', msg);
            console.warn(msg);
            return false;
        }
        return true;
    };

    const abrirBanco = async () => {
        try {
            const database = await SQLite.openDatabaseAsync('PAM2.db');
            setDb(database);
            Alert.alert('✅ Sucesso', 'Banco aberto/criado com sucesso');
            console.log('✅ Banco aberto/criado com sucesso');
        } catch (error) {
            Alert.alert('❌ Erro', 'Erro ao abrir banco');
            console.error('❌ Erro ao abrir banco:', error);
        }
    };

    const criarTabela = async () => {
        if (!db) {
            const msg = 'Crie o banco primeiro!';
            Alert.alert('Atenção', msg);
            console.warn(msg);
            return;
        }

        try {
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS TB_USUARIO (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL
            );
        `);
            setTabelaCriada(true);
            Alert.alert('✅ Sucesso', 'Tabela criada com sucesso');
            console.log('✅ Tabela TB_USUARIO criada com sucesso');
        } catch (error) {
            Alert.alert('❌ Erro', 'Erro ao criar tabela');
            console.error('❌ Erro ao criar tabela:', error);
        }
    };


    const inserirDados = async () => {
        if (!verificarBancoETabela()) return;

        try {
            await db!.execAsync(`
                INSERT INTO TB_USUARIO (nome) VALUES 
                ('Ricardo'), ('Zé Matraca'), ('Maria');
            `);
            Alert.alert('✅ Sucesso', 'Dados inseridos');
            console.log('✅ Dados inseridos com sucesso');
        } catch (error) {
            Alert.alert('❌ Erro', 'Erro ao inserir dados');
            console.error('❌ Erro ao inserir dados:', error);
        }
    };

    const exibirDados = async () => {
        if (!verificarBancoETabela()) return;

        try {
            const rows = await db!.getAllAsync('SELECT * FROM TB_USUARIO');
            if (rows.length === 0) {
                const msg = 'Nenhum registro encontrado';
                Alert.alert('Informação', msg);
                console.log(msg);
            } else {
                Alert.alert('Ver no console', '📋 Veja os dados no console');
                console.log('📋 Registros encontrados:\n', rows);
            }
        } catch (error) {
            Alert.alert('❌ Erro', 'Erro ao exibir dados');
            console.error('❌ Erro ao exibir dados:', error);
        }
    };

    const alterarDado = async () => {
        if (!verificarBancoETabela()) return;
        if (!idAlterar || !novoNome) {
            const msg = 'Preencha o ID e o novo nome!';
            Alert.alert('Aviso', msg);
            console.warn(msg);
            return;
        }

        try {
            const result = await db!.runAsync(
                'UPDATE TB_USUARIO SET nome = ? WHERE id = ?',
                novoNome,
                Number(idAlterar)
            );

            if (result.changes === 0) {
                const msg = `Nenhum usuário com ID ${idAlterar} encontrado`;
                Alert.alert('Aviso', msg);
                console.warn(msg);
            } else {
                const msg = `Usuário ${idAlterar} atualizado para "${novoNome}"`;
                Alert.alert('✅ Sucesso', msg);
                console.log('✅', msg);
            }

            setIdAlterar('');
            setNovoNome('');
        } catch (error) {
            Alert.alert('❌ Erro', 'Erro ao atualizar');
            console.error('❌ Erro ao atualizar:', error);
        }
    };

    const excluirDados = async () => {
        if (!verificarBancoETabela()) return;

        try {
            await db!.execAsync('DELETE FROM TB_USUARIO');
            Alert.alert('Sucesso', '🗑️  Todos os dados foram apagados');
            console.log('🗑️  Todos os dados foram apagados da tabela TB_USUARIO');
        } catch (error) {
            Alert.alert('❌ Erro', 'Erro ao excluir');
            console.error('❌ Erro ao excluir dados:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Gerenciador de Usuários</Text>

            <View style={styles.buttonContainer}>
                <Button title="Criar Banco" onPress={abrirBanco} />
                <Button title="Criar Tabela" onPress={criarTabela} />
                <Button title="Inserir Dados" onPress={inserirDados} />
                <Button title="Exibir Dados" onPress={exibirDados} />
            </View>

            <Text style={styles.label}>Alterar Usuário</Text>
            <TextInput
                style={styles.input}
                placeholder="ID do usuário"
                keyboardType="numeric"
                value={idAlterar}
                onChangeText={setIdAlterar}
            />
            <TextInput
                style={styles.input}
                placeholder="Novo nome"
                value={novoNome}
                onChangeText={setNovoNome}
            />
            <Button title="Alterar Usuário" onPress={alterarDado} color="#007bff" />

            <View style={{ marginTop: 20 }}>
                <Button title="Excluir Todos" onPress={excluirDados} color="#dc3545" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 4,
        color: '#555',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        width: '100%',
        gap: 10,
    },
});

export default Banco;
