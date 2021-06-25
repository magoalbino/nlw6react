import { Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Modal from 'react-modal';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg'; 

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useState } from 'react';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>(); //pegar parametro da url
  const roomId = params.id;
  const { title, questions  } = useRoom(roomId);
  const history = useHistory();
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();

  async function hanleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string | undefined){

    if(questionId === undefined) {
      return;
    }
    
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    
    setQuestionIdModalOpen(undefined);
    // if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
    //   await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    // }
  }

  async function handleSetQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={hanleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
        {
          questions.map(question => {
            return (
              <Fragment key={question.id}>
                <Question 
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (<>
                    <button
                    type="button"
                    onClick={() => handleSetQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>)}
                  <button
                    type="button"
                    onClick={() => setQuestionIdModalOpen(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>                
              </Fragment>
            );
          })
        }
        </div>
      </main>
      <Modal 
        isOpen={questionIdModalOpen !== undefined}
        onRequestClose={() => setQuestionIdModalOpen(undefined)}
      >
        <button onClick={() => handleDeleteQuestion(questionIdModalOpen)}> Deletar </button>
        <button onClick={() => setQuestionIdModalOpen(undefined)}> Fechar </button>
      </Modal>
    </div>
  );
}