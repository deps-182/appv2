import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, deleteDoc, updateDoc} from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL,deleteObject } from "firebase/storage"

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService)

  getAuth() {
    return getAuth();
  }

  iniciarSesion(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  Registrarse(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  actualizarUsuario(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  cerrarSesion() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }
  //agregar
  agDispositivo(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //almacenar

  async subirImagen(path: string, DataUrl: string){
    return uploadString(ref(getStorage(),path), DataUrl, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path))
    })

  }
  //obtener dispositivos 
  getCollectionData(path:string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField:'id'});
  }

  //eliminar dispositivos
  eliminarDispositivos(path: string){
    return deleteDoc(doc(getFirestore(),path));
  }

  //obtener ruta imagen 
  async getFilePath(url:string){
    return ref(getStorage(), url).fullPath
  }

  //actualizar
  updateDocument(path:string,data:any){
    return updateDoc(doc(getFirestore(),path),data);
  }

  //eliminar
  eliminarDocument(path:string){
    return deleteObject(ref(getStorage(),path));
  }
}