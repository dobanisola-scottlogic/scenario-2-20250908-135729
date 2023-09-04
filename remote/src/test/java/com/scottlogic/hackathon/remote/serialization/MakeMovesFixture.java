package com.scottlogic.hackathon.remote.serialization;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import com.scottlogic.hackathon.game.Direction;
import com.scottlogic.hackathon.game.Id;
import com.scottlogic.hackathon.game.Move;
import com.scottlogic.hackathon.game.MoveImpl;

public class MakeMovesFixture {

  IdGenerator IdGenerator = new IdGenerator();

  Id player1Id = IdGenerator.next();
  Id player2Id = IdGenerator.next();

  public final String movesJson =
      "[{\"player\":"
          + player1Id.getId()
          + ",\"direction\":\"NORTH\"},"
          + "{\"player\":"
          + player2Id.getId()
          + ",\"direction\":\"NORTH\"}]";
  public final List<Move> moves = createTestMoves();

  private List<Move> createTestMoves() {
    List<Move> moves = new ArrayList<>();
    moves.add(new MoveImpl(player1Id, Direction.NORTH));
    moves.add(new MoveImpl(player2Id, Direction.NORTH));

    return moves;
  }

  class IdGenerator {
    AtomicLong lastId = new AtomicLong();

    Id next() {
      return new Id(lastId.incrementAndGet());
    }
  }
}
