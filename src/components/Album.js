import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);
  
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0.5,
      isPlaying: false,
      songHasMouseOver: album.songs[0],
      hasMouseOver: false 
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: (e) => {
        this.setState({currentTime: this.audioElement.currentTime});
      },
      durationchange: (e) => {
        this.setState({duration: this.audioElement.duration});
      },
      volumechange: (e) => {
        this.setState({volume: this.audioElement.volume});
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if(this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if(!isSameSong) {this.setSong(song);}
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length-1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({currentTime: newTime});
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({volume: newVolume});
  }

  mouseEnter(song) {
    this.setState({ songHasMouseOver: song,
                    hasMouseOver: true });
  }

  mouseOut() {this.setState({ hasMouseOver: false })};

  giveInfo(song, index) {
    if (this.state.currentSong === song && this.state.isPlaying === true) {
      return <i className="icon ion-md-pause"></i>;
    } else if (this.state.currentSong === song && this.state.isPlaying === false) {
      return <i className="icon ion-md-play"></i>;
    } else if (this.state.songHasMouseOver === song && this.state.hasMouseOver === true) {
      return <i className="icon ion-md-play"></i>;
    } else {
      return index + 1;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) {
      return `-:--`
    }
    let mins = parseInt(seconds/60);
    let secs = parseInt(seconds % 60);
    let time = secs < 10 ? `${mins}:0${secs}` : `${mins}:${secs}`
    return time;
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
        <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody>
             {
               this.state.album.songs.map((song, index) => 
                <tr className="song" key={index} onClick={() => this.handleSongClick(song)} 
                    onMouseEnter={() => this.mouseEnter(song)} onMouseLeave={() => this.mouseOut()}>
                  <td>{this.giveInfo(song, index)}</td>
                  <td>{song.title}</td>
                  <td>{`${this.formatTime(song.duration)} seconds`}</td>
                </tr>
               )
             }
           </tbody>
         </table>  
         <PlayerBar isPlaying={this.state.isPlaying} 
                    currentSong={this.state.currentSong}
                    currentTime={this.state.currentTime}
                    duration={this.state.duration}
                    volume={this.state.volume}
                    formatTime={this.formatTime}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={(e) => this.handleTimeChange(e)}
                    handleVolumeChange={(e) => this.handleVolumeChange(e)} />
      </section>
    );
  }
}

export default Album;