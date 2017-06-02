import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import $ from 'jquery'
import 'fotorama/fotorama'
import { If } from '../../../../../../../../../../../common/ifc'
import trs from '../../../../../../../../../../../../getTranslations'

function isMyFile(file) {
  return /^image\//.test(file.mimeType) && file.size < 3 * 1000000;
}

const ImageCaption = React.createClass({
  toMb(value) {
    var resVal = (Number(value) / 1000 / 1000).toFixed(1);
    if (resVal == '0.0')
      resVal = '0.1';
    return resVal + ' ' + trs('record.fields.file.size');
  },

  render() {
    let file = this.props.file;

    return (
      <div className="file-image">
        <div className="file-image__title">
          <a href={file.url} target="_blank">{file.title}</a>
        </div>

        <div className="file-image__control">
          <span className="size">
            {this.toMb(file.size)}
          </span>
          {!this.props.readOnly ? (<span title={trs('record.fields.file.remove')} onClick={this.props.onRemove} className="m-close" />) : null}
        </div>
        <div className="clear"></div>
      </div>
    );
  }
});

const ImageViewer = React.createClass({
  statics: {
    isMyFile
  },

  getInitialState() {
    return {
      images: [],
      currentFile: false
    };
  },

  getDefaultProps() {
    return {
      files: [],
      options: {
        nav: 'thumbs',
        navposition: 'top',
        loop: true,
        allowFullScreen: true
      }
    };
  },

  componentDidMount() {
    this.initFotorama(this.props.files || []);
    this.setState({ images: this.props.files });
  },

  componentWillReceiveProps(nextProps) {
    let files = nextProps.files || [];
    if (this.state.images.length != files.length) {
      this.updateFotorama(files);
      this.setState({ images: files });
      if (!files.length) {
        //Был удален последний файл, скрываем подзаголовок
        this.setState({ currentFile: false });
      }
    }
  },

  initFotorama(images) {
    images = images.map(file => {
      let image = {
        img: file.url,
      };
      if (file.metadata && file.metadata.preview && file.metadata.thumbnail) {
        image = {
          full: file.url,
          img: file.metadata.preview,
          thumb: file.metadata.thumbnail,
        };
      }
      return image
    });
    $(ReactDOM.findDOMNode(this.fotorama))
      .fotorama(_.merge({}, {
        data: images
      }, this.props.options))
      .on('fotorama:show', (e, fotorama) => {
        let currentFile = this.state.images.find((file) => ((file.metadata && file.metadata.preview) ? file.metadata.preview : file.url) === fotorama.activeFrame.img);
        this.setState({ currentFile })
      })
      .on('fotorama:ready', (e, fotorama) => {
        if (this.state.images.length > 0 && !this.state.currentFile) {
          this.setState({
            currentFile: this.state.images[0]
          })
        }
      });
  },

  updateFotorama(newImages) {
    let $fotorama = $(ReactDOM.findDOMNode(this.fotorama));
    let api = $fotorama.data('fotorama');

    //Удаление устаревших
    let deleted = this.state.images.filter(image => !(_.find(newImages, testImage => testImage.id == image.id)));
    let added = newImages.filter(image => !(_.find(this.state.images, testImage => testImage.id == image.id)));

    if (deleted.length > 0) {
      api.destroy();
      this.initFotorama(newImages);
    } else if (added) {
      //Добавление новых
      added.forEach(file => {
        let image = {
          img: file.url,
        };
        if (file.metadata && file.metadata.preview && file.metadata.thumbnail) {
          image = {
            full: file.url,
            img: file.metadata.preview,
            thumb: file.metadata.thumbnail,
          };
        }
        api.push(image);
      });
      //Выделение последнего файла
      api.show('>>');
      this.setState({
        currentFile: _.last(added)
      })
    }
  },

  render() {
    return (
      <div>
        <div ref={(ref) => this.fotorama = ref}
          className="fotorama"
          data-width="100%"
          data-max-width="100%"
          data-height="300px"
          data-auto="false"
          data-fit="scaledown"
        ></div>
        <If condition={this.state.currentFile}>
          <ImageCaption
            file={this.state.currentFile}
            onRemove={() => this.props.removeFn(this.state.currentFile)}
          />
        </If>
      </div>
    );
  }
});

export default ImageViewer;
