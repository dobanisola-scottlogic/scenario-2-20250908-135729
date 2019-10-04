package com.scottlogic.hackathon.remote.server;

import com.scottlogic.hackathon.remote.Turn;
import com.scottlogic.hackathon.remote.notify.ConnectionChangeSupport;


import java.io.IOException;

public class Interactor implements Sender, Receiver {

    private final RemoteBotSocketProtocol protocol;
    private final RemoteBotSocketAdapter adapter;

    Interactor(ConnectionChangeSupport changeSupport, Turn turn) {
        this.protocol = new RemoteBotSocketProtocol(this, changeSupport, turn);
        this.adapter = new RemoteBotSocketAdapter(this);
    }


    public void receive(String message){
        protocol.receive(message);
    }

    public void send(String message) throws IOException {
        adapter.send(message);
    }


    public void sendPing() {
        if(!adapter.sendPing()){
            protocol.cancelHeartBeat();
            protocol.notifyBotDisconnected();
        }
    }

    public void sendDisconnect() throws IOException {
        adapter.close();
        protocol.cancelHeartBeat();
    }

    RemoteBotSocketAdapter getAdapter() {
        return adapter;
    }

}
