import React, {useState} from 'react';

import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../../queries';
import { useParams } from "react-router-dom"

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

function UploadModal(props) {
  const { id } = useParams
  const [food, setFood] = useState(false);
  const [showhandleCloseUploadModal, setShowhandleCloseUploadModal] = useState(props.isOpen);

  if(props.type == food){
    setFood(true)
}
  const [uploadImage] = useMutation(queries.UPLOAD_IMAGE, {
    update(cache, {data: {uploadImage}}) {
      const { images } = cache.readQuery({query: queries.GET_IMAGES});
      cache.writeQuery({
        query: queries.GET_IMAGES,
        data: {images: images.concat([uploadImage])}
      });
    }
  });

//   const [addEmployer] = useMutation(queries.UPLOAD_IMAGE, {
//     update(cache, {data: {addEmployer}}) {
//       const {employers} = cache.readQuery({
//         query: queries.GET_EMPLOYERS_WITH_EMPLOYEES
//       });
//       cache.writeQuery({
//         query: queries.GET_EMPLOYERS_WITH_EMPLOYEES,
//         data: {employers: employers.concat([addEmployer])}
//       });
//     }
//   });

//   const {data} = useQuery(queries.GET_EMPLOYERS);

  const handleClosehandleCloseUploadModal = () => {
    setShowhandleCloseUploadModal(true);
    props.handleClose(false);
  };

  let body = null;
  let imageDescription;
  let url;
  let userId;
    body = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          uploadImage({
            variables: {
              url : url,
              food: food,
              description: imageDescription.value,
              rid: id,
              userId: "Default value"
            }
          });
          imageDescription.value = '';
          url.value = '';
          userId.value = '1';
          setShowhandleCloseUploadModal(false);
          alert('Image Added');
          props.handleClose();
        }}
      >
        <div >
          <label>
            Upload Image
            <br />
            <input
              ref={(node) => {
                url = node;
              }}
              required
              autoFocus={true}
            />
          </label>
        </div>
        <br />
        <div >
          <label>
            Image Description
            <br />
            <input
              ref={(node) => {
                imageDescription = node;
              }}
              required
            />
          </label>
        </div>
        <br />

        <button type='submit'>
          Upload Picture
        </button>
      </form>
    );
 
  return (
    <div>
      <ReactModal
        name='handleCloseUploadModal'
        isOpen={showhandleCloseUploadModal}
        contentLabel='Upload Modal'
        style={customStyles}
      >
        {body}
        <button className='button cancel-button' onClick={handleClosehandleCloseUploadModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );
}

export default UploadModal;